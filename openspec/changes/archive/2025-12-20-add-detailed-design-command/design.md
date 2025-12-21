# Design: Create Detailed Design

## Overview
This change adds a new Specs view context menu action that generates a consolidated `detailed-design.md` for a selected change. The generation uses a user-editable Copilot prompt stored in `.github/prompts/openspec-create-detailed-design.prompt.md`.

## Key Decisions
- **Scope / target node**: The command is attached to Specs view *change* items (context value `change`), because the inputs (proposal/tasks/design/delta specs) are organized under `openspec/changes/<change-id>/`.
- **Output location**: Write `detailed-design.md` alongside `proposal.md`, `tasks.md`, and `design.md` under the change directory.
- **Prompt ownership**: The prompt file is owned by the user/project. The extension only bootstraps a starter file when missing and never overwrites it.

## Data Flow
1. User triggers "Create Detailed Design" on a change item.
2. Extension ensures the prompt file exists (create starter if missing).
3. Extension reads:
   - `.github/prompts/openspec-create-detailed-design.prompt.md`
   - `openspec/changes/<change-id>/proposal.md`
   - `openspec/changes/<change-id>/tasks.md`
   - `openspec/changes/<change-id>/design.md` (if present)
   - all delta specs under `openspec/changes/<change-id>/specs/**/spec.md`
4. Extension sends a composed prompt to Copilot chat.
5. Extension scaffolds `openspec/changes/<change-id>/detailed-design.md` if missing and opens it for editing.
6. User pastes the Copilot output into `detailed-design.md`.
7. Specs view refreshes so `detailed-design.md` appears and is navigable.

## Error Handling
- If required inputs (proposal/tasks) are missing, show an actionable error and do not invoke Copilot.
- If the prompt file cannot be created or read, show an actionable error.
- If Copilot invocation fails, surface the failure; do not modify `detailed-design.md` content.

## Testing Strategy
- Provider test: `detailed-design.md` is only included in the change node children when present.
- Command/prompt test: prompt file creation happens only when missing.
