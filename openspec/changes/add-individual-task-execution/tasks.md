# Implementation Tasks

## Phase 1: CodeLens Provider Enhancement
- [ ] Update `SpecTaskCodeLensProvider.provideCodeLenses` to parse task lines using regex pattern `/^(\s*)-\s*\[\s*\]\s*(.+)$/gm`
- [ ] Generate CodeLens instances for each incomplete task at the line immediately before the task line
- [ ] Set CodeLens button label to "$(play) Execute This Task" with tooltip "Execute only this task"
- [ ] Pass task metadata (line number, task text, document URI) as command arguments to `openspec-for-copilot.spec.implTaskSingle`
- [ ] Add unit tests for task line parsing with various formats (indentation, spacing, special characters)

## Phase 2: Command Registration
- [ ] Register new command `openspec-for-copilot.spec.implTaskSingle` in `register-spec-commands.ts`
- [ ] Extract task context from command arguments (task line number, task text)
- [ ] Call `specManager.runOpenSpecApply` with task-specific parameters
- [ ] Add error handling for invalid task context or missing task data

## Phase 3: Spec Manager Update
- [ ] Extend `SpecManager.runOpenSpecApply` signature to accept optional task context parameter: `taskContext?: { taskNumber: number; taskText: string }`
- [ ] Add conditional logic to append task execution mode instructions when `taskContext` is provided
- [ ] Format task execution instructions with task number and text interpolation
- [ ] Ensure task-specific instructions are appended after detailed-design hint but before `id: ${changeId}`
- [ ] Add unit tests for prompt generation in both batch and individual modes

## Phase 4: Integration Testing
- [ ] Test individual task execution with a sample `tasks.md` containing 3+ tasks
- [ ] Verify CodeLens buttons appear only above incomplete tasks
- [ ] Verify clicking individual task button sends correct prompt to Copilot
- [ ] Verify Copilot updates only the executed task line to `- [x]`
- [ ] Test interaction between individual and batch execution (run individual task, then batch)
- [ ] Test with `detailed-design.md` present and absent
- [ ] Verify no regression in existing "Start All Tasks" functionality

## Phase 5: Documentation & Spec Update
- [ ] Update `openspec/specs/codelens/spec.md` with modified and added requirements
- [ ] Add inline code comments explaining task parsing logic
- [ ] Update README or user documentation if task execution behavior is documented
- [ ] Archive this change proposal after successful deployment

## Acceptance Criteria
- CodeLens buttons appear above each incomplete task in `tasks.md`
- Clicking individual task button executes only that task
- Task completion updates only the executed task line
- Existing batch execution remains functional
- All unit tests pass
- No TypeScript or linting errors
