# CodeLens Requirements

## MODIFIED Requirements

### CodeLens for Tasks
The `tasks.md` file shall display a CodeLens action at the top of the file to initiate task execution.

#### Scenario: Incomplete tasks exist
Given a `tasks.md` file with at least one incomplete task (e.g., `- [ ] Task 1`)
When the CodeLens is rendered
Then it displays "$(play) Start All Tasks"
And clicking it triggers the `kiro-codex-ide.spec.implTask` command.

#### Scenario: All tasks completed
Given a `tasks.md` file where all tasks are marked as complete (e.g., `- [x] Task 1`)
When the CodeLens is rendered
Then it displays "$(check) All Tasks Completed"
And clicking it performs no action (or triggers a status notification).
