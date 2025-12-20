# Proposal: Add Detailed Design Command

## Why
Teams using OpenSpec often need a detailed design document that consolidates the intent (proposal), requirements/specs, implementation plan (tasks), and technical approach (design). Today this is a manual, error-prone copy/paste process.

## What Changes
- Add a Specs view context menu command on change items: "Create Detailed Design".
- The command ensures `detailed-design.md` exists under the selected change directory (`openspec/changes/<change-id>/detailed-design.md`) by scaffolding it when missing.
- The command uses a user-editable prompt file at `.github/prompts/openspec-add-detailed-design.prompt.md`.
- If `.github/prompts/openspec-add-detailed-design.prompt.md` does not exist, create it with a minimal starter prompt (only on first run; do not overwrite user edits).
- When `detailed-design.md` exists, show it as a clickable document in the Specs view under the change item.

## Impact
- Affected capability: `spec-explorer`
- User-visible UI: one additional context menu item on change nodes in the Specs view.
- Files:
  - Reads: `openspec/changes/<change-id>/proposal.md`, `tasks.md`, optional `design.md`, and delta specs under `openspec/changes/<change-id>/specs/**/spec.md`
  - Writes: scaffolds `openspec/changes/<change-id>/detailed-design.md` (if missing) and possibly `.github/prompts/openspec-add-detailed-design.prompt.md` (if missing)
