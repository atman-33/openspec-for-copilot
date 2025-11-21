# codelens Specification

## Purpose
Defines the CodeLens functionality for task execution within the OpenSpec environment.

## Requirements
### Requirement: CodeLens for Tasks
The extension MUST provide a CodeLens action at the top of `tasks.md` files to initiate task execution.

#### Scope
This applies to `tasks.md` files located within the `openspec` directory or configured specs path.

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

