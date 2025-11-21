# Support OpenSpec Folder Structure

## Context
The current extension implementation expects specs to be located in `.codex/specs` and follows a specific structure (`requirements.md`, `design.md`, `tasks.md`).
The project is migrating to `openspec-for-copilot`, which uses a different folder structure under `openspec/`:
- `openspec/specs/`: Contains current system specifications.
- `openspec/changes/`: Contains change proposals.

## Problem
The "SPECS" view in the extension does not reflect the `openspec` folder structure. It looks for files in the wrong location and expects a file naming convention that doesn't match OpenSpec standards (e.g., `spec.md` vs `requirements.md`).

## Solution
Update `SpecManager` and `SpecExplorerProvider` to support the OpenSpec folder structure.

### Key Changes
1.  **Configuration**: Update default paths to point to `openspec/`.
2.  **Spec Discovery**:
    - Scan `openspec/specs/` for current specs.
    - Scan `openspec/changes/` for change proposals.
3.  **Tree View Structure**:
    - Root level items: "Current Specs" and "Changes" (or similar grouping).
    - Under "Current Specs": List of specs (e.g., `auth`), expanding to `spec.md`.
    - Under "Changes": List of changes (e.g., `add-2fa`), expanding to `proposal.md`, `tasks.md`, `design.md`, and delta specs.
4.  **Navigation**: Open the correct files when clicked.

## Impact
- **Users**: Will see their OpenSpec files directly in the IDE side panel.
- **Codebase**: Refactoring of `SpecManager` and `SpecExplorerProvider`.
