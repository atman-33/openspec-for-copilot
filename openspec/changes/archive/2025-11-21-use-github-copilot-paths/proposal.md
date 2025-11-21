# Use GitHub Copilot Paths for Prompts

## Summary
Update the default paths for project and global prompts to align with GitHub Copilot conventions, replacing `.codex` references with `.github`.

## Motivation
The extension is being adapted for "OpenSpec for Copilot". The current implementation uses `.codex/prompts` for project prompts and `~/.codex/prompts` for global prompts. To better integrate with the GitHub Copilot ecosystem, these should be changed to `.github/prompts` and `~/.github/prompts` respectively.

## Proposed Changes

### 1. Update Default Configuration
Modify `src/constants.ts` to change the default prompt path.

- **Current:** `.codex/prompts`
- **New:** `.github/prompts`

### 2. Update Global Prompts Path
Modify `src/providers/prompts-explorer-provider.ts` to change the global prompts root directory.

- **Current:** `~/.codex/prompts`
- **New:** `~/.github/prompts`

### 3. Update Config Manager (Optional but recommended)
Ensure `ConfigManager` correctly handles the new default paths and any legacy configuration if necessary.

## Implications
- Existing users with prompts in `.codex/prompts` will need to move them to `.github/prompts`.
- The extension will now look for prompts in the `.github` directory, which is the standard location for GitHub-related configuration.
