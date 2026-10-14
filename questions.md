# Trident Assistant Evaluation Cases

This is a practical regression set, not an exhaustive list of every possible question or Jenkins failure. Run each chat question through the normal chat interface. For log-diagnosis cases, submit the code-block contents through **Analyze Jenkins log**. Expected answers are key facts, not exact wording.

## Evaluation guidelines

- Check factual correctness, source support, and whether the answer distinguishes log evidence from a possible cause.
- For chat, check that the response uses the application's four sections: **Answer**, **Possible Root Cause**, **Recommended Actions**, and **Reference Sources**.
- For Jenkins diagnosis, check that citations include the actual Jenkins line ranges and any relevant knowledge files. The supplied snippets contain no blank lines, so their displayed order starts at log line 1.
- A knowledge source should only be cited when it supports the claim. If the requested detail is absent, the assistant should say so instead of inventing a command, setting, permission name, or procedure.
- The Jenkins log workflow redacts likely secrets on a best-effort basis. Do not use real credentials in test logs.

# Part A — Knowledge-base chat

## C1. Namespace validation fails

**Question:** Why is namespace validation failing?

**Expected answer:** The namespace may be missing or unapproved in the Trident registry, or the cluster identity may not be on the onboarding pipeline allowlist. Also check the Trident service account's project-metadata permissions and whether its authorization token is current. Correct the registry or access issue, then rerun validation; changing application code is not the first step.

**Expected sources:** `knowledge/onboarding.md`; `knowledge/office_hours_sessions/session_001.md`; `knowledge/trident_faq.md`.

## C2. Onboarding returns access denied

**Question:** Why do we see access denied errors during onboarding?

**Expected answer:** The Trident service account may lack the required read and write access to project metadata, often because permissions were not granted during provisioning. Correct the permission set and rerun validation. If onboarding changes were made, confirm the authorization token was refreshed.

**Expected sources:** `knowledge/onboarding.md`; `knowledge/office_hours_sessions/session_001.md`.

## C3. Service account cannot read project metadata

**Question:** What should we check when the Trident service account cannot read project metadata?

**Expected answer:** Verify its read and write permissions on project metadata and confirm its authorization token is current. Rerun the validation after correcting access.

**Expected sources:** `knowledge/onboarding.md`; `knowledge/office_hours_sessions/session_001.md`.

## C4. New namespace onboarding sequence

**Question:** What steps should I follow to get a new Trident namespace through onboarding validation?

**Expected answer:** Create the namespace, validate service-account permissions, verify the registry entry and approval (including the cluster identity allowlist where relevant), then run the final validation workflow.

**Expected sources:** `knowledge/onboarding.md`.

## C5. Namespace missing from registry

**Question:** What is the recommended first step when the namespace is missing from the registry?

**Expected answer:** Check the registry record and register or approve the namespace before rerunning validation. Then check service-account access and deployment-secret rotation if problems remain.

**Expected sources:** `knowledge/jira_runbooks.md`; `knowledge/onboarding.md`.

## C6. Deployment blocked before application code runs

**Question:** Why is the deployment blocked before application code is even evaluated?

**Expected answer:** Namespace registration/approval or another validation gate can fail before application evaluation. Check registry and approval state, then service-account access and configuration. Start with the runtime contract instead of assuming an application-code defect.

**Expected sources:** `knowledge/jira_runbooks.md`; `knowledge/onboarding.md`; `knowledge/office_hours_sessions/session_001.md`; `knowledge/trident_faq.md`.

## C7. Common namespace approval problems

**Question:** What are common causes of namespace approval issues?

**Expected answer:** A missing or partial registry entry, an approval that exists in the source environment but not the target, expired credentials, stale environment variables, or a source/target policy mismatch can block validation. Verify the target registry and approval record, then reconcile access and configuration.

**Expected sources:** `knowledge/trident_faq.md`; `knowledge/migration_guide.md`; `knowledge/office_hours_sessions/session_002.md`; `knowledge/office_hours_sessions/session_003.md`.

## C8. Migration validation fails before cutover

**Question:** What usually causes migration validation to fail before cutover?

**Expected answer:** The destination namespace may not be registered or approved; service-account or secret material may be missing or stale; environment variables may differ; or repository-token scopes may be insufficient when a package or image changes. Compare source and target state, correct the relevant access/approval gap, and run a dry run before cutover.

**Expected sources:** `knowledge/migration_guide.md`; `knowledge/office_hours_sessions/session_002.md`.

## C9. Source is approved, target is not

**Question:** The namespace is approved in the source cluster. Is that enough to migrate?

**Expected answer:** No. Approval is environment-specific. Verify registration and approval in the destination environment before scheduling cutover; source approval alone does not satisfy the target gate.

**Expected sources:** `knowledge/migration_guide.md`; `knowledge/office_hours_sessions/session_002.md`.

## C10. Pre-cutover checklist

**Question:** What should we check before the migration traffic shift?

**Expected answer:** Compare source and target registries, confirm destination namespace approval, validate environment variables, verify the Trident service account can read deployment manifests, check repository-token scopes if a package or image changed, and run a dry-run validation before the final traffic shift.

**Expected sources:** `knowledge/migration_guide.md`; `knowledge/office_hours_sessions/session_002.md`.

## C11. Migration decision record

**Question:** What must be included in the migration decision record?

**Expected answer:** The target namespace, approval timestamp, and owner. The record demonstrates the destination cluster had clean onboarding status before the migration activity window.

**Expected sources:** `knowledge/migration_guide.md`.

## C12. Stale credentials or secrets

**Question:** What should we do if migration credentials or secrets may be stale?

**Expected answer:** Reconcile the service-account secret/credential material between environments, verify relevant environment variables and access-token scopes, and rerun migration validation. Do not skip the destination namespace registry check. Reissuing a service-account secret is described as a recovery step.

**Expected sources:** `knowledge/migration_guide.md`; `knowledge/office_hours_sessions/session_003.md`.

## C13. Repository access failure

**Question:** Why is repository access a common Trident incident cause, and what should we verify?

**Expected answer:** The Trident service account may lack repository access or have insufficient/expired token scopes. Restore access or reissue the relevant secret/token, rerun validation, and confirm the validator passes in the target environment.

**Expected sources:** `knowledge/jira_runbooks.md`; `knowledge/migration_guide.md`.

## C14. Incident triage order and escalation note

**Question:** What order does the runbook recommend for namespace validation triage, and what should we capture before escalation?

**Expected answer:** Check the namespace registry record first, then service-account access, then deployment-secret rotation. Capture the affected namespace, application owner, latest validation run, validation error, suspected cause, and mitigation already taken.

**Expected sources:** `knowledge/jira_runbooks.md`.

## C15. Repository failure appears after namespace gate

**Question:** The incident is labelled repository access, but namespace validation is the first failing step. What should we investigate first?

**Expected answer:** Namespace validation is a gating check and may fail before repository access is evaluated; repository access can be secondary. Resolve the namespace and permission mismatch, record registry and access state, then rerun the full pipeline. Reconcile stale credentials or environment variables if indicated.

**Expected sources:** `knowledge/office_hours_sessions/session_003.md`; `knowledge/jira_runbooks.md`.

## C16. Approval exception

**Question:** What must the change owner validate for a namespace approval exception?

**Expected answer:** Validate both cluster policy and repository access before the rollback window opens.

**Expected sources:** `knowledge/trident_faq.md`.

## C17. Exact permission names are not documented

**Question:** Which exact IAM role name and command should I use to grant the Trident service account project-metadata access?

**Expected answer:** The sources require read and write access to project metadata, but do not specify an IAM role name or command. Say that the exact role/command cannot be determined from the available knowledge and direct the user to the owning platform team's approved procedure. Do not invent a role or command.

**Expected sources:** `knowledge/onboarding.md` supports the required access level; it does not support a specific role name or command. The answer should explicitly note this limitation.

## C18. Unsupported retry limit

**Question:** How many times should I retry validation before escalating?

**Expected answer:** The knowledge sources say to rerun validation after correcting the issue and describe what to capture for escalation, but they do not define a retry count. State that no retry limit is documented; do not invent one.

**Expected sources:** `knowledge/onboarding.md`; `knowledge/jira_runbooks.md`.

# Part B — Jenkins log diagnosis

Submit each code block on its own using **Analyze Jenkins log**. Expected line references below use the line order shown inside the corresponding block.

## J1. Namespace absent from Trident registry

**Jenkins console log:**

```text
Started by user release-bot
[Pipeline] stage
[Pipeline] { (Validate namespace)
ERROR: Namespace payments-prod is not registered in Trident
Validation failed before application deployment
[Pipeline] }
Finished: FAILURE
```

**Expected diagnosis:** The directly observed failure is the missing `payments-prod` registry entry at log line 4; validation stopped before application deployment at line 5. The supported likely cause is that the namespace has not been registered/approved. Recommend verifying the Trident registry and approval, then rerunning validation. Do not suggest changing application code.

**Expected references:** Jenkins console log lines 4-5; `knowledge/onboarding.md`; `knowledge/jira_runbooks.md`.

## J2. Project-metadata permission denied

**Jenkins console log:**

```text
Started by user onboarding-bot
[Pipeline] stage
[Pipeline] { (Validate service account)
Checking project metadata permissions for trident-service
ERROR: Access denied while reading project metadata
Validation failed: required permission check did not pass
[Pipeline] }
Finished: FAILURE
```

**Expected diagnosis:** The log shows access denied while reading project metadata at line 5 and a failed permission check at line 6. Missing or incomplete Trident service-account access is a supported cause. Recommend checking the service account's project-metadata read/write permissions, correcting them through the approved process, and rerunning validation. Do not invent role names.

**Expected references:** Jenkins console log lines 5-6; `knowledge/onboarding.md`; `knowledge/office_hours_sessions/session_001.md`.

## J3. Repository token permission scope

**Jenkins console log:**

```text
Started by user release-bot
[Pipeline] stage
[Pipeline] { (Checkout package)
Requesting package from internal repository
ERROR: Repository access denied for Trident service account
ERROR: Access token does not have the required permission scope
script returned exit code 1
Finished: FAILURE
```

**Expected diagnosis:** The repository denied the Trident service account and the token lacks a required scope (lines 5-7). This matches the documented repository-access failure pattern. Recommend verifying repository access and token scopes, reissuing credentials only if needed, then rerunning validation and confirming the target validator passes.

**Expected references:** Jenkins console log lines 5-7; `knowledge/jira_runbooks.md`; `knowledge/migration_guide.md`.

## J4. Target namespace approved only in source environment

**Jenkins console log:**

```text
Started by user migration-bot
[Pipeline] stage
[Pipeline] { (Validate target)
Source namespace approval: APPROVED
Target namespace approval: NOT_FOUND
ERROR: Namespace approval missing in destination cluster
Migration validation failed before cutover
Finished: FAILURE
```

**Expected diagnosis:** The source is approved but the target approval is missing (lines 4-6). Approval is environment-specific, so source approval is not sufficient. Verify/register/approve the namespace in the destination, then run a dry-run validation before cutover.

**Expected references:** Jenkins console log lines 4-7; `knowledge/migration_guide.md`; `knowledge/office_hours_sessions/session_002.md`.

## J5. Stale environment configuration or credentials

**Jenkins console log:**

```text
Started by user migration-bot
[Pipeline] stage
[Pipeline] { (Prepare cutover)
Comparing source and target service account configuration
WARNING: Target environment variable TRIDENT_NAMESPACE is stale
ERROR: Service account credential is expired
Cutover validation failed
Finished: FAILURE
```

**Expected diagnosis:** The log directly reports a stale target environment variable and expired service-account credential (lines 5-6). These are documented migration failure patterns. Recommend reconciling target configuration and credential/secret material, verifying service-account access, and rerunning a dry-run validation. Do not repeat or expose credential values if present in a real log.

**Expected references:** Jenkins console log lines 5-7; `knowledge/migration_guide.md`; `knowledge/trident_faq.md`; `knowledge/office_hours_sessions/session_003.md`.

## J6. Cluster identity missing from onboarding allowlist

**Jenkins console log:**

```text
Started by user onboarding-bot
[Pipeline] stage
[Pipeline] { (Namespace validation)
Namespace payments-stage is registered
ERROR: Cluster identity is not present in onboarding pipeline allowlist
Service validation scan was not started
Finished: FAILURE
```

**Expected diagnosis:** The namespace is registered, but the cluster identity is missing from the onboarding pipeline allowlist (line 5), so the service validation scan did not start (line 6). This allowlist requirement is documented. Recommend verifying the approved allowlist entry and rerunning validation after it is corrected.

**Expected references:** Jenkins console log lines 5-6; `knowledge/onboarding.md`.

## J7. Namespace gate fails before repository stage

**Jenkins console log:**

```text
Started by user release-bot
[Pipeline] stage
[Pipeline] { (Namespace validation)
ERROR: Namespace orders-prod is not approved in target cluster
Pipeline stopped: namespace validation gate failed
[Pipeline] }
[Pipeline] stage
[Pipeline] { (Repository checkout)
Stage skipped because an earlier stage failed
Finished: FAILURE
```

**Expected diagnosis:** Namespace approval is the first failing gate at lines 4-5; the repository stage was skipped afterward at lines 8-9. Diagnose and resolve the target namespace approval first. Do not claim repository access caused this run's initial failure; it was not evaluated.

**Expected references:** Jenkins console log lines 4-5 and 8-9; `knowledge/office_hours_sessions/session_003.md`; `knowledge/migration_guide.md`.

## J8. Migration package/image change with repository access failure

**Jenkins console log:**

```text
Started by user migration-bot
[Pipeline] stage
[Pipeline] { (Deploy package)
Package image changed since the last approved migration
ERROR: Repository token scope denied while fetching package
Migration validation did not pass
Finished: FAILURE
```

**Expected diagnosis:** The log says the package image changed and repository-token scope was denied (lines 4-5). The knowledge base specifically recommends checking repository-token scopes when a package or image changes. Verify the account's repository access and token scopes, then rerun migration validation and a dry run before cutover.

**Expected references:** Jenkins console log lines 4-6; `knowledge/migration_guide.md`.

## J9. Generic compiler error absent from Trident guidance

**Jenkins console log:**

```text
Started by user build-bot
[Pipeline] stage
[Pipeline] { (Compile)
src/PaymentService.java:42: error: cannot find symbol
symbol: variable retryWindow
location: class PaymentService
1 error
script returned exit code 1
Finished: FAILURE
```

**Expected diagnosis:** The observed failure is a compile-time unresolved symbol `retryWindow` in `PaymentService.java` at log lines 4-6; the build exits unsuccessfully at line 8. The Trident knowledge sources do not explain this compiler error or prescribe a code fix. State that the root cause/fix is not established by the available Trident sources; do not assert it is a namespace, credential, or repository issue. It is acceptable to recommend asking the application owner to inspect the indicated source location, clearly labelled as a general next check rather than a runbook instruction.

**Expected references:** Jenkins console log lines 4-6 and 8; explicitly state that no supporting Trident knowledge source was found for the compiler-specific fix. Do not cite unrelated files as proof.

## J10. Timeout with no documented Trident-specific cause

**Jenkins console log:**

```text
Started by user build-bot
[Pipeline] stage
[Pipeline] { (Run integration tests)
Starting integration test suite
ERROR: Test stage exceeded configured timeout of 20 minutes
Pipeline aborted by timeout
Finished: FAILURE
```

**Expected diagnosis:** The log establishes that the integration-test stage exceeded its configured 20-minute timeout (lines 4-5). The available Trident knowledge does not describe this test timeout or establish why the tests ran long. Report the observed timeout, state that its underlying cause is not established by the supplied evidence, and do not invent a Trident configuration fix.

**Expected references:** Jenkins console log lines 4-5; no Trident knowledge source should be cited as evidence for a timeout root cause.

## J11. Multiple failures and triage order

**Jenkins console log:**

```text
Started by user release-bot
[Pipeline] stage
[Pipeline] { (Namespace validation)
ERROR: Namespace analytics-prod is not registered
Access check: Trident service account cannot read project metadata
Pipeline stopped at namespace validation gate
[Pipeline] }
Finished: FAILURE
```

**Expected diagnosis:** Both a missing namespace registration and denied project-metadata access are reported (lines 4-5); the pipeline stopped at namespace validation (line 6). The runbook's triage order is registry first, then service-account access, then secret rotation. Recommend correcting these documented checks and rerunning validation without presenting either finding as definitively the sole root cause.

**Expected references:** Jenkins console log lines 4-6; `knowledge/jira_runbooks.md`; `knowledge/onboarding.md`.

## J12. Empty or irrelevant console output

**Input:** Submit a non-empty log such as:

```text
Started by user build-bot
Checking out source
Downloading dependencies
Build finished
```

**Expected diagnosis:** There is no explicit error or failure indicator in this excerpt. The assistant should not invent a Jenkins failure cause. It should say the provided excerpt does not identify a failure and request the failed stage or the console output around the first error and final failure summary. If no Trident evidence is retrieved, do not cite unrelated knowledge files.

**Expected references:** Cite only the provided Jenkins line range if referring to observed output; no Trident knowledge source is required.

## J13. Secret-redaction check

**Jenkins console log:**

```text
Started by user release-bot
TOKEN=example-not-a-real-token-12345
[Pipeline] stage
[Pipeline] { (Validate)
ERROR: Namespace secret-check is not registered
Finished: FAILURE
```

**Expected diagnosis:** Diagnose the visible namespace-registration failure at log line 5. The sample token is intentionally fake; verify that the submitted Claude prompt and backend diagnostic logs contain a redaction marker instead of the supplied token value. The assistant must not repeat secret-looking values in its answer.

**Expected references:** Jenkins console log lines 5-6; `knowledge/onboarding.md`. This case also checks that the `TOKEN` value is redacted before prompt construction.
