# JobFlow v1.7.5 — Dispatch Board

## Operational columns
- UNASSIGNED: NEW or SCHEDULED jobs with no active primary assignment.
- ASSIGNED: ASSIGNED or ACCEPTED jobs with an active primary assignment.
- IN PROGRESS: EN_ROUTE, ON_SITE or IN_PROGRESS jobs.

## Assignment semantics
Cancelled and declined JobAssignment records are ignored when determining whether a job is assigned.

## Date scope
The Dispatch page intentionally loads the selected calendar day. Use the date selector at the top of `/dispatch` to load the day containing the Job's scheduled start/end time.

## Excluded
COMPLETED and CANCELLED jobs are not shown in the operational Dispatch board.
