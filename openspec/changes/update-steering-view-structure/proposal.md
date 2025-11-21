# Update Steering View Structure

## Summary
Update the Steering view to support OpenSpec and GitHub Copilot conventions, replacing the legacy Codex-specific structure.

## Motivation
The current Steering view is designed for "Codex" and looks for `~/.codex/AGENTS.md`. We want to align with "OpenSpec x GitHub Copilot" by supporting standard Copilot instruction files and OpenSpec specific files.

## Proposed Changes
1.  **Remove** support for `~/.codex/AGENTS.md` and `{workspace}/AGENTS.md` (unless it matches the new paths).
2.  **Add** support for the following file structure in the Steering view:
    *   **Global**: `~/.github/copilot-instructions.md`
    *   **Project**:
        *   `.github/copilot-instructions.md`
        *   `openspec/AGENTS.md`
        *   `AGENTS.md` (Root)
        *   `openspec/project.md`
3.  **Update** the Tree View to display these items with appropriate labels and icons.
4.  **Update** the "Create Rule" commands to create these files if they don't exist (prioritizing `openspec/AGENTS.md` for project rules and `~/.github/copilot-instructions.md` for global).

## Detailed Design
The `SteeringExplorerProvider` will be updated to check for these files.

### Tree Structure
- **Global Instructions** (`~/.github/copilot-instructions.md`)
- **Project Instructions**
    - `Copilot Instructions` (`.github/copilot-instructions.md`)
    - `Agent Instructions` (`openspec/AGENTS.md`)
    - `Root Instructions` (`AGENTS.md`)
- **Project Spec**
    - `Project Definition` (`openspec/project.md`)

### Commands
- `createGlobalRule`: Creates `~/.github/copilot-instructions.md`
- `createProjectRule`: Creates `openspec/AGENTS.md` (Default) or prompts user? -> Let's default to `openspec/AGENTS.md` as this is "OpenSpec for Copilot".
