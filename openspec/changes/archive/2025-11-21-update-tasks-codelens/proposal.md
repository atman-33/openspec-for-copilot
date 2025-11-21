# Update Tasks CodeLens Behavior

## Summary
Update the `tasks.md` CodeLens to be context-aware: show "Start All Tasks" only when incomplete tasks exist, and "All Tasks Completed" when finished.

## Motivation
The current "Start Task" button is ambiguous (it runs all tasks) and appears even when all tasks are done. This change improves clarity and feedback.

## Proposed Changes
- Rename "Start Task" to "Start All Tasks".
- Parse `tasks.md` content to check for incomplete tasks (`[ ]`).
- If incomplete tasks exist: Show "$(play) Start All Tasks".
- If all tasks are complete (`[x]`): Show "$(check) All Tasks Completed" (non-clickable or informative).
