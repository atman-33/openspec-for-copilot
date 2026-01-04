# Tasks: Support Codex Chat Integration

- [x] Add `openspec-for-copilot.aiAgent` configuration to `package.json` <!-- id: 0 -->
- [x] Create `CodexService` or similar to handle the Codex workflow (temp file creation, opening, selecting, command execution) <!-- id: 1 -->
- [x] Update `ChatPromptRunner` (or equivalent) to switch between `GitHubCopilot` and `Codex` based on configuration <!-- id: 2 -->
- [x] Verify `github-copilot` mode still works as expected <!-- id: 3 -->
- [x] Verify `codex` mode creates the file and executes the command <!-- id: 4 -->
