# Trident Knowledge Assistant Test Questions

Use these cases to manually check whether answers are grounded in the listed knowledge sources. Expected answers describe key points to look for rather than exact wording.

## 1. Namespace validation failure

Question: Why is namespace validation failing?

Source: `knowledge/onboarding.md`; `knowledge/office_hours_sessions/session_001.md`

Expected answer: First confirm the namespace is registered and approved in the Trident registry. Then verify the Trident service account can access project metadata and that its authorization token is current. Correct the registry or access issue and rerun validation; a code rollback is usually not the first step.

## 2. Migration validation failure

Question: What usually causes migration validation to fail?

Source: `knowledge/migration_guide.md`; `knowledge/office_hours_sessions/session_002.md`

Expected answer: Common causes include a namespace missing from the target cluster's registry or approval list, differences between source and target approvals, stale credentials or environment variables, and insufficient service-account or repository permissions. Check the destination registry and access first, then run a dry-run validation.

## 3. Onboarding access denied

Question: Why do we see access denied errors during onboarding?

Source: `knowledge/onboarding.md`; `knowledge/office_hours_sessions/session_001.md`

Expected answer: The Trident service account may not have the required read and write access to project metadata, or its authorization token may not have been refreshed after an onboarding change. Correct the permissions or refresh the token, then rerun validation.

## 4. Service account cannot read project metadata

Question: What should we check when the Trident service account cannot read project metadata?

Source: `knowledge/onboarding.md`; `knowledge/office_hours_sessions/session_001.md`

Expected answer: Verify that the Trident service account has the expected read and write permissions on project metadata and that its authorization token is current. After correcting access, rerun the validation scan.

## 5. Deployment blocked before application evaluation

Question: Why is the deployment blocked before application code is even evaluated?

Source: `knowledge/jira_runbooks.md`; `knowledge/office_hours_sessions/session_001.md`; `knowledge/trident_faq.md`

Expected answer: A namespace registration or approval check can fail as an early deployment gate, before application code is evaluated. Check the namespace registry and approval state, then service-account permissions and configuration. Diagnose the runtime and access contract before changing application code.

## 6. Namespace approval issues

Question: What are the most common causes of namespace approval issues?

Source: `knowledge/trident_faq.md`; `knowledge/migration_guide.md`; `knowledge/office_hours_sessions/session_002.md`

Expected answer: The namespace may be missing or only partially registered, or approval may exist in the source environment but not the target. Stale credentials, environment variables, or a policy mismatch can also block validation. Verify the target registry and approval record, then reconcile access and configuration.

## 7. Failed target-cluster cutover

Question: How do we resolve a failed cutover in the target cluster?

Source: `knowledge/migration_guide.md`; `knowledge/office_hours_sessions/session_002.md`

Expected answer: Confirm the namespace is registered and approved in the destination cluster, verify service-account permissions and environment variables, and check repository access when a package or image changed. Refresh or reissue stale credentials as needed, then pass a dry-run validation before retrying the cutover.

## 8. Stale credentials

Question: What does the migration runbook say about stale credentials?

Source: `knowledge/migration_guide.md`; `knowledge/jira_runbooks.md`

Expected answer: Reconcile stale service-account credentials or secrets, verify environment variables and repository access-token scopes, then rerun migration validation. Do not skip the destination namespace registry check.

## 9. Namespace missing from registry

Question: What is the recommended first step when the namespace is missing from the registry?

Source: `knowledge/jira_runbooks.md`; `knowledge/onboarding.md`

Expected answer: Check the namespace's registry record and get it registered or approved before rerunning validation. Then verify service-account access and secret rotation status if validation still fails.

## 10. Repository access incident

Question: Why is repository access a common incident cause in Trident?

Source: `knowledge/jira_runbooks.md`; `knowledge/migration_guide.md`

Expected answer: The Trident service account may be missing repository access or have an expired token or insufficient permission scopes. Restore access or reissue the token, rerun validation, and confirm the validator passes in the target environment.

## 11. New namespace onboarding

Question: What steps should I follow to get a new Trident namespace through onboarding validation?

Source: `knowledge/onboarding.md`

Expected answer: Create the namespace, register and approve it in the Trident registry, validate the service-account permissions for project metadata, and run the final validation workflow. If it fails, check the registry entry and access configuration, correct the issue, and rerun validation.
