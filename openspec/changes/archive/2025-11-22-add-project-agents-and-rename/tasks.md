## 1. Explorer Updates
- [x] 1.1 Audit `PromptsExplorerProvider` path helpers to confirm how project prompts and instructions resolve today.
- [x] 1.2 Add a `Project Agents` tree group (and item source) that reads from `.github/agents`, mirrors the empty-state messaging, and renders after `Project Instructions`.
- [x] 1.3 Ensure refresh events, click handlers, and runnable context values behave the same way for agent files as other project assets.

## 2. Context Menu Commands
- [x] 2.1 Update `package.json` contributions so prompt/instruction/agent file items expose a `Rename` command above `Delete` and rename the existing "Delete Prompt" label.
- [x] 2.2 Implement the rename command (input validation, directory creation, overwrite checks, refresh) in the provider or supporting utility so it works for all prompt sources.
- [x] 2.3 Wire the new command into the tree view context, ensure Copilot chat state is unaffected, and surface actionable error messages when renames fail.

## 3. Validation
- [x] 3.1 Add/adjust unit tests covering the new group, ordering, and rename behavior (provider + command contributions).
- [x] 3.2 Exercise the Prompts explorer manually to confirm `.github/agents` files appear correctly and the rename/delete commands behave as expected.
- [x] 3.3 Run `openspec validate add-project-agents-and-rename --strict`, `npm run lint`, and targeted Vitest suites before requesting review.
