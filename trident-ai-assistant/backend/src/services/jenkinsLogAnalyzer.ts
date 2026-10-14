export const MAX_JENKINS_LOG_CHARACTERS = 500_000;

const MAX_EVIDENCE_CHARACTERS = 32_000;
const MAX_FAILURE_MATCHES = 25;
const failurePattern = /\b(?:error|exception|failed|failure|fatal|panic|denied|timed?\s*out|could not|unable to|not found|script returned|exit code [1-9]\d*|returned non-zero)\b/i;
const secretAssignmentPattern = /((?:"?)[A-Za-z0-9_.-]*(?:password|passwd|pwd|token|secret|api[_-]?key|client[_-]?secret|access[_-]?key|authorization|auth[_-]?token)[A-Za-z0-9_.-]*(?:"?)\s*[:=]\s*)(?:"[^"\r\n]*"|'[^'\r\n]*'|[^\s,;]+)/gi;
const privateKeyPattern = /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/gi;

export interface JenkinsFailureEvidence {
  excerpt: string;
  references: string[];
  searchText: string;
  totalLines: number;
  matchedFailureLines: number;
}

export function redactJenkinsSecrets(log: string): string {
  return log
    .replace(/\u001b\][^\u0007]*(?:\u0007|\u001b\\)/g, '')
    .replace(/\u001b\[[0-?]*[ -/]*[@-~]/g, '')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .replace(/\b(set-cookie|cookie)\s*:\s*[^\r\n]*/gi, '$1: [REDACTED]')
    .replace(privateKeyPattern, '[REDACTED PRIVATE KEY]')
    .replace(/\b(Bearer|Basic)\s+[A-Za-z0-9._~+/-]+=*/gi, '$1 [REDACTED]')
    .replace(secretAssignmentPattern, '$1[REDACTED]')
    .replace(/(--?(?:password|token|secret|api[-_]?key)\s+)(?:"[^"\r\n]*"|'[^'\r\n]*'|[^\s]+)/gi, '$1[REDACTED]')
    .replace(/\b(gh[pousr]_[A-Za-z0-9_]{20,}|glpat-[A-Za-z0-9_-]{16,})\b/g, '[REDACTED TOKEN]')
    .replace(/\bAKIA[0-9A-Z]{16}\b/g, '[REDACTED AWS KEY]')
    .replace(/(https?:\/\/)[^/\s:@]+:[^/\s@]+@/gi, '$1[REDACTED]@');
}

function mergeLineRanges(lines: number[], lineCount: number): Array<{ start: number; end: number }> {
  const ranges = lines
    .map((line) => ({ start: Math.max(0, line - 2), end: Math.min(lineCount - 1, line + 2) }))
    .sort((left, right) => left.start - right.start);
  const merged: Array<{ start: number; end: number }> = [];

  for (const range of ranges) {
    const previous = merged[merged.length - 1];
    if (previous && range.start <= previous.end + 1) {
      previous.end = Math.max(previous.end, range.end);
    } else {
      merged.push({ ...range });
    }
  }

  return merged;
}

export function extractJenkinsFailureEvidence(redactedLog: string): JenkinsFailureEvidence {
  const lines = redactedLog.split(/\r?\n/);
  const failureLines = lines
    .map((line, index) => failurePattern.test(line) ? index : -1)
    .filter((line) => line >= 0);

  const selectedFailureLines = failureLines.length > MAX_FAILURE_MATCHES
    ? [...failureLines.slice(0, 15), ...failureLines.slice(-10)]
    : failureLines;
  const ranges = selectedFailureLines.length > 0
    ? mergeLineRanges(selectedFailureLines, lines.length)
    : [{ start: Math.max(0, lines.length - 80), end: lines.length - 1 }];

  const excerptBlocks: string[] = [];
  const references: string[] = [];
  let excerptLength = 0;
  const contextLines = new Set<number>();

  for (const range of ranges) {
    const block = lines
      .slice(range.start, range.end + 1)
      .map((line, index) => {
        const lineNumber = range.start + index;
        const content = line.length > 2_000 ? `${line.slice(0, 2_000)} [line truncated]` : line;
        return `${String(lineNumber + 1).padStart(5, '0')} | ${content}`;
      })
      .join('\n');
    const addition = `${excerptBlocks.length > 0 ? '\n\n' : ''}Source: Jenkins console log lines ${range.start + 1}-${range.end + 1}\n${block}`;
    if (excerptLength + addition.length > MAX_EVIDENCE_CHARACTERS) {
      break;
    }
    excerptBlocks.push(addition);
    excerptLength += addition.length;
    for (let line = range.start; line <= range.end; line += 1) contextLines.add(line);
    references.push(`Jenkins console log lines ${range.start + 1}-${range.end + 1}`);
  }

  const excerpt = excerptBlocks.join('');
  return {
    excerpt,
    references,
    searchText: [...contextLines]
      .sort((left, right) => left - right)
      .map((line) => lines[line])
      .join(' ')
      .slice(0, 8_000),
    totalLines: lines.length,
    matchedFailureLines: failureLines.length,
  };
}
