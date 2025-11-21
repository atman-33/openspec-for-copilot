# CodeLens Requirements

## MODIFIED Requirements

### Requirement: Task Execution CodeLens
The extension MUST provide a CodeLens to execute tasks defined in `tasks.md` files.

#### Scenario: Tasks in OpenSpec folder
Given a `tasks.md` file located within the `openspec` directory (e.g., `openspec/changes/my-change/tasks.md`)
When the file is opened in the editor
Then a "Start Task" (play icon) CodeLens should appear above each task list item
