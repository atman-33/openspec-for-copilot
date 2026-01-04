# Tasks: Add Archive Change Custom Instructions

- [ ] Add `openspec-for-copilot.customInstructions.archiveChange` to `package.json` and place it directly below "Start All Task" (adjust `order` values as needed) <!-- id: 0 -->
- [ ] Extend `OpenSpecSettings.customInstructions` to include `archiveChange` and ensure it is loaded by `ConfigManager` <!-- id: 1 -->
- [ ] Extend `ChatContext.instructionType` to include `archiveChange` and ensure `buildChatPrompt` injects it correctly <!-- id: 2 -->
- [ ] Update the "Archive Change" command to call `sendPromptToChat(..., { instructionType: "archiveChange" })` <!-- id: 3 -->
- [ ] Add/extend unit tests for prompt injection and config loading (including Archive Change) <!-- id: 4 -->
- [ ] Run `npm test` <!-- id: 5 -->
- [ ] Run `npm run compile` <!-- id: 6 -->
- [ ] Run `openspec validate 2026-01-04-add-archive-change-custom-instructions` <!-- id: 7 -->
- [ ] Run `openspec validate --all` <!-- id: 8 -->
