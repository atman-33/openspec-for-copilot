# Design: Project Instructions Display

## Problem
The user wants to see files from `.github/instructions` in the Prompts view.
There are two main approaches:
1. **Unified**: Mix prompts and instructions in the "Project" folder.
2. **Separated**: Create separate folders/groups for "Project Prompts" and "Project Instructions".

## Analysis

### Option 1: Unified
- **Pros**: Simpler UI (fewer top-level items). Matches current Global folder structure (where users might mix them).
- **Cons**: Cluttered if many files exist. Harder to distinguish between runnable prompts and passive instructions.

### Option 2: Separated (Recommended)
- **Pros**: Clear distinction between "Prompts" (templates/actions) and "Instructions" (rules/context). Mirrors the file system structure (`.github/prompts` vs `.github/instructions`).
- **Cons**: More top-level items.

## Decision
We recommend **Option 2** (Separated) for better organization.
The view will be structured as:
1. Global (`.../prompts`)
2. Project Prompts (`.github/prompts`)
3. Project Instructions (`.github/instructions`)

*Note: We will keep Global as is for now, as there is no standard "Global Instructions" path defined yet, but we can split it later if needed.*

## UI Changes
- The `PromptsExplorerProvider` will be updated to return 3 top-level items (or 4 if we split Global).
- New context values might be needed for instruction items if they have different behaviors (e.g., maybe not "runnable" in the same way, or just opening them).
