# codelens Specification Delta

## MODIFIED Requirements

### Requirement: CodeLens for Tasks
The extension MUST provide CodeLens actions in `tasks.md` files to initiate task execution, both for all tasks and for individual tasks.

#### Scope
This applies to `tasks.md` files located within the `openspec` directory or configured specs path.

#### Scenario: Incomplete tasks exist - batch execution
Given a `tasks.md` file with at least one incomplete task (e.g., `- [ ] Task 1`)
When the CodeLens is rendered at the top of the file
Then it displays "$(play) Start All Tasks"
And clicking it triggers the `openspec-for-copilot.spec.implTask` command to execute all incomplete tasks.

#### Scenario: All tasks completed
Given a `tasks.md` file where all tasks are marked as complete (e.g., `- [x] Task 1`)
When the CodeLens is rendered at the top of the file
Then it displays "$(check) All Tasks Completed"
And clicking it performs no action (or triggers a status notification).

## ADDED Requirements

### Requirement: Individual Task Execution via CodeLens
The extension MUST provide a CodeLens action above each incomplete task line to enable individual task execution.

#### Scope
- CodeLens buttons appear only for incomplete tasks (`- [ ] ...`)
- No CodeLens buttons are displayed for completed tasks (`- [x] ...`)
- Task lines are identified via regex pattern matching

#### Scenario: Execute a single incomplete task
Given a `tasks.md` file with multiple tasks including:
```
- [ ] Task 1: Implement feature A
- [ ] Task 2: Add tests for feature A
- [x] Task 3: Update documentation
```
When the file is opened
Then a CodeLens button appears above Task 1 line displaying "$(play) Execute This Task"
And a CodeLens button appears above Task 2 line displaying "$(play) Execute This Task"
And no CodeLens button appears above Task 3 (already completed)
And clicking the button above Task 1 triggers `openspec-for-copilot.spec.implTaskSingle` with Task 1 context.

#### Scenario: Individual task execution updates only target task
Given a `tasks.md` file with tasks:
```
- [ ] Task 1: Implement feature A
- [ ] Task 2: Add tests for feature A
```
When the user clicks "Execute This Task" above Task 1
Then Copilot receives a prompt to execute only Task 1
And after completion, Task 1 line is updated to `- [x] Task 1: Implement feature A`
And Task 2 line remains unchanged as `- [ ] Task 2: Add tests for feature A`.

#### Scenario: Individual task execution with detailed-design.md reference
Given a change with both `tasks.md` and `detailed-design.md` present
When the user clicks "Execute This Task" for Task 2
Then the prompt includes the standard detailed-design hint
And the prompt includes task-specific execution instructions for Task 2
And Copilot uses detailed-design.md as implementation guidance for that specific task.

### Requirement: Task-Specific Prompt Generation
The system MUST generate task-specific execution instructions when running individual tasks.

#### Scope
- Reuses existing `openspec-apply.prompt.md` template
- Appends runtime task execution context (task number, task text)
- Instructs Copilot to limit scope to the specified task

#### Scenario: Prompt includes task execution mode instructions
Given a user clicks "Execute This Task" for Task 2: "Add tests for feature A"
When the prompt is generated
Then it includes the base prompt from `openspec-apply.prompt.md`
And it includes detailed-design hint if applicable
And it appends:
```markdown
---

# Task Execution Mode
Execute ONLY the following specific task:

**Task 2:** Add tests for feature A

After completion:
- Update ONLY this task line from `- [ ]` to `- [x]`
- Do NOT modify other task lines
- Do NOT proceed to subsequent tasks
```
And the final line contains `id: ${changeId}`.
