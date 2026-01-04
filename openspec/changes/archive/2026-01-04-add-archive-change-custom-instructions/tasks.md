# Tasks: Add Archive Change Custom Instructions

- [x] Add `openspec-for-copilot.customInstructions.archiveChange` to `package.json` and place it directly below "Start All Task" (adjust `order` values as needed) <!-- id: 0 -->
- [x] Extend `OpenSpecSettings.customInstructions` to include `archiveChange` and ensure it is loaded by `ConfigManager` <!-- id: 1 -->
- [x] Extend `ChatContext.instructionType` to include `archiveChange` and ensure `buildChatPrompt` injects it correctly <!-- id: 2 -->
- [x] Update the "Archive Change" command to call `sendPromptToChat(..., { instructionType: "archiveChange" })` <!-- id: 3 -->
- [x] Add/extend unit tests for prompt injection and config loading (including Archive Change) <!-- id: 4 -->
- [x] Run `npm test` <!-- id: 5 -->
- [x] Run `npm run compile` <!-- id: 6 -->
- [x] Run `openspec validate 2026-01-04-add-archive-change-custom-instructions` <!-- id: 7 -->
- [x] Run `openspec validate --all` <!-- id: 8 -->
