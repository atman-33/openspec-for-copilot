# Tasks: Use GitHub Copilot Paths for Prompts

- [x] 1. Update `DEFAULT_CONFIG` in `src/constants.ts` to use `.github/prompts` instead of `.codex/prompts`.
- [x] 2. Update `getGlobalPromptsRoot` and `getGlobalPromptsLabel` in `src/providers/prompts-explorer-provider.ts` to use `.github/prompts` instead of `.codex/prompts`.
- [x] 3. Verify that `ConfigManager` picks up the new default path.
