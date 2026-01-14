# Implementation Tasks

## Phase 1: CodeLens Provider Enhancement
- [x] Update `SpecTaskCodeLensProvider.provideCodeLenses` to parse task lines using regex pattern `/^(\s*)-\s*\[\s*\]\s*(.+)$/gm`
- [x] Generate CodeLens instances for each incomplete task at the line immediately before the task line
- [x] Set CodeLens button label to "$(play) Execute This Task" with tooltip "Execute only this task"
- [x] Pass task metadata (line number, task text, document URI) as command arguments to `openspec-for-copilot.spec.implTaskSingle`
- [x] Add unit tests for task line parsing with various formats (indentation, spacing, special characters)

## Phase 2: Command Registration
- [x] Register new command `openspec-for-copilot.spec.implTaskSingle` in `register-spec-commands.ts`
- [x] Extract task context from command arguments (task line number, task text)
- [x] Call `specManager.runOpenSpecApply` with task-specific parameters
- [x] Add error handling for invalid task context or missing task data

## Phase 3: Spec Manager Update
- [x] Extend `SpecManager.runOpenSpecApply` signature to accept optional task context parameter: `taskContext?: { taskNumber: number; taskText: string }`
- [x] Add conditional logic to append task execution mode instructions when `taskContext` is provided
- [x] Format task execution instructions with task number and text interpolation
- [x] Ensure task-specific instructions are appended after detailed-design hint but before `id: ${changeId}`
- [x] Add unit tests for prompt generation in both batch and individual modes

## Phase 4: Integration Testing
- [x] Test individual task execution with a sample `tasks.md` containing 3+ tasks
- [x] Verify CodeLens buttons appear only above incomplete tasks
- [x] Verify clicking individual task button sends correct prompt to Copilot
- [x] Verify Copilot updates only the executed task line to `- [x]`
- [x] Test interaction between individual and batch execution (run individual task, then batch)
- [x] Test with `detailed-design.md` present and absent
- [x] Verify no regression in existing "Start All Tasks" functionality

## Phase 5: Documentation & Spec Update
- [x] Update `openspec/specs/codelens/spec.md` with modified and added requirements
- [x] Add inline code comments explaining task parsing logic
- [x] Update README or user documentation if task execution behavior is documented
- [x] Archive this change proposal after successful deployment

## Acceptance Criteria
- CodeLens buttons appear above each incomplete task in `tasks.md`
- Clicking individual task button executes only that task
- Task completion updates only the executed task line
- Existing batch execution remains functional
- All unit tests pass
- No TypeScript or linting errors
