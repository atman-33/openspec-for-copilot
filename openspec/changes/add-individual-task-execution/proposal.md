# Proposal: Add Individual Task Execution

## Overview
Extend the CodeLens functionality in `tasks.md` files to provide individual task execution buttons alongside the existing "Start All Tasks" button. Users will be able to execute tasks one at a time, allowing for granular control over task execution flow.

## Why
Users need the ability to execute tasks incrementally rather than all at once. The current "Start All Tasks" button is useful for comprehensive execution, but lacks flexibility when:
- Testing a specific implementation step before proceeding
- Working through complex changes that require manual verification between tasks
- Debugging or refining a single task without re-running completed work
- Maintaining control over execution pace in large task lists

Individual task execution enables more precise, testable, and controlled workflows while preserving the efficiency of batch execution for straightforward cases.

## Background
Currently, the extension provides a single CodeLens button at the top of `tasks.md` files that executes all incomplete tasks at once. While this batch execution is useful for comprehensive task completion, users sometimes need to:
- Execute a specific task without running all subsequent tasks
- Test or verify a single task implementation independently
- Work incrementally through tasks with manual checkpoints between steps

This change introduces per-task execution buttons while preserving the existing batch execution capability.

## Scope

### In Scope
- Add CodeLens buttons above each incomplete task line (`- [ ] ...`)
- Implement individual task execution command that targets a specific task
- Extend prompt generation to include task-specific execution context
- Update task completion tracking to mark only the executed task as complete
- Maintain existing "Start All Tasks" functionality unchanged

### Out of Scope (Explicit Exclusions)
- Re-execution of completed tasks (no buttons displayed for `- [x]` lines)
- Dependency resolution between tasks (tasks execute independently)
- Interactive task selection dialog (buttons provide direct execution)
- Parallel task execution (individual tasks run sequentially as invoked)
- Custom task execution order (tasks execute in the order they appear)

## Technical Approach

### CodeLens Provider Enhancement
Modify `SpecTaskCodeLensProvider` to:
1. Parse task lines using regex to identify incomplete tasks (`- [ ] ...`)
2. Generate CodeLens instances at line positions immediately before each task
3. Pass task-specific metadata (line number, task text) to the execution command

### Command Registration
Add new command `openspec-for-copilot.spec.implTaskSingle` that:
1. Accepts task line number and task text as arguments
2. Calls `SpecManager.runOpenSpecApply` with individual task context
3. Distinguishes from batch execution mode via optional parameters

### Prompt Generation
Extend `SpecManager.runOpenSpecApply` to:
1. Accept optional task context parameter (task number, text)
2. Append task-specific execution instructions when in single-task mode
3. Instruct Copilot to update only the specified task line to `- [x]`
4. Reuse existing `openspec-apply.prompt.md` template with runtime additions

### Example Prompt Addition (Individual Mode)
```markdown
---

# Task Execution Mode
Execute ONLY the following specific task:

**Task ${taskNumber}:** ${taskText}

After completion:
- Update ONLY this task line from `- [ ]` to `- [x]`
- Do NOT modify other task lines
- Do NOT proceed to subsequent tasks
```

## Reference Materials
- [src/providers/spec-task-code-lens-provider.ts](src/providers/spec-task-code-lens-provider.ts): Current CodeLens implementation
- [src/features/spec/spec-manager.ts](src/features/spec/spec-manager.ts): Task execution logic in `runOpenSpecApply` method
- [src/activation/commands/register-spec-commands.ts](src/activation/commands/register-spec-commands.ts): Command registration
- [openspec/specs/codelens/spec.md](openspec/specs/codelens/spec.md): Existing CodeLens specification

## Impact Analysis

### User Experience
- **Positive**: Granular control over task execution enables incremental, testable workflows
- **Positive**: Visual consistency with existing CodeLens UI patterns
- **Neutral**: More buttons in the editor (may increase visual density)

### Implementation Complexity
- **Low-Medium**: Builds on existing CodeLens and prompt generation infrastructure
- Regex parsing of task lines is straightforward
- Command routing follows established patterns

### Maintenance
- **Low**: Changes are localized to CodeLens provider and spec manager
- Prompt template remains centralized for future updates

## Risks & Mitigations

### Risk: Task line parsing fragility
If task format varies (indentation, additional markers), regex may fail to match.
- **Mitigation**: Use robust regex with whitespace tolerance, add unit tests for edge cases

### Risk: Prompt instruction conflicts
Individual task instructions could conflict with existing prompt template guidance.
- **Mitigation**: Append task-specific instructions clearly demarcated with headers, test with various task types

### Risk: User confusion about execution scope
Users might expect dependencies or subsequent tasks to run automatically.
- **Mitigation**: Use clear button labels ("Execute This Task" vs "Start All Tasks"), document behavior in hover tooltips

## Alternatives Considered

### Alternative 1: Separate prompt template for individual tasks
Create `.github/prompts/openspec-apply-single.prompt.md` with task-focused instructions.
- **Rejected**: Increases maintenance burden, diverges prompt logic, harder to keep templates aligned

### Alternative 2: Interactive task picker dialog
Show a dialog listing all tasks, allowing multi-select before execution.
- **Rejected**: Adds UI complexity, slower than direct CodeLens click for common case

### Alternative 3: Right-click context menu on task lines
Provide "Execute Task" option in editor context menu instead of CodeLens.
- **Rejected**: Less discoverable than inline CodeLens, inconsistent with existing UI pattern
