## Context
The Prompts explorer currently builds three groups (Global, Project Prompts, Project Instructions) from different directories. `.github/agents` content is not surfaced even though Chat flows depend on it, and the context menu only offers Run/Create/Delete actions. Users must rename files via the OS, and the menu label still reads "Delete Prompt" even when operating on instructions.

## Goals
- Surface `.github/agents` files inside the Prompts tree with the same UX affordances as the other project folders.
- Keep the root group ordering deterministic so instructions still precede agents.
- Provide an in-place rename command that works for prompts, instructions, and agents without corrupting content.
- Align context-menu strings with their broadened scope.

## Non-Goals
- No bulk or multi-select rename flows.
- No changes to how prompts are parsed or compiled.
- No automatic creation or seeding of `.github/agents` content.

## Decisions
1. **Tree source abstraction:** Reuse `createPromptItems` by introducing a new `PromptSource` literal (`"project-agents"`) and a helper that resolves `.github/agents`. This keeps filtering/empty-state logic centralized.
2. **Ordering enforcement:** Extend `getRootItems` to insert the new group after `Project Instructions` and cover the requirement via unit tests to prevent regressions.
3. **Rename implementation:** Register a new command (e.g., `openspec-for-copilot.prompts.rename`) that prompts for a new filename, validates input with the same guardrails as `createPrompt`, and calls `workspace.fs.rename(sourceUri, targetUri, { overwrite: false })`. Refresh the tree on success and show actionable `window.showErrorMessage` text on failure.
4. **Menu contributions:** Add the rename command to the `view/item/context` menus for prompt tree items, positioned before the existing delete command, and update the delete label to "Delete" to reflect its generalized use.

## Risks / Trade-offs
- **Missing directories:** `.github/agents` may not exist; we will mirror the existing "No prompts found" empty state to avoid errors.
- **Rename collisions:** Users might pick a path that already exists. We will leverage `overwrite: false` and show an error so no content is clobbered.
- **Long-running refreshes:** Reusing the existing refresh debounce ensures the tree does not thrash; no additional throttling is required.

## Open Questions
- Should the rename dialog force the `.prompt.md` suffix for prompt files? (Default plan: respect current filename to avoid accidental suffix loss.)
- Do agent files require additional validation (e.g., `.md` only), or should we keep parity with existing folder behavior?
