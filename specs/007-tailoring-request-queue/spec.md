# Structured tailoring request queue

## Outcome

Replace ad-hoc chat prompts for job-specific CV work with versioned, validated request files that point to a captured job description and declare language, base-CV selection, priorities, privacy and lifecycle state.

## Non-goals

- Run AI tailoring in GitHub Actions.
- Publish a job-specific CV by default.
- Treat matching keywords as evidence for a candidate claim.

## Acceptance criteria

- A user can duplicate one template, set it to `ready`, validate it locally, commit it, and ask the agent to process the queue.
- Validation confirms job-file existence, canonical CV references, permitted state values and basic request shape.
- The request lifecycle explicitly records when input/review is required.
- Default delivery remains private and no tailored CV is publicly exposed without an explicit later decision.
