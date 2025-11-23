# Tasks: Add New Agent File Button

- [x] Register `openspec-for-copilot.prompts.createAgentFile` command in `package.json` <!-- id: 0 -->
- [x] Add "New Agent File" menu item to `view/title` for `openspec-for-copilot.views.promptsExplorer` in `package.json` with `group: "navigation@1"` <!-- id: 1 -->
- [x] Update "New Instruction File" menu item group to `navigation@2` in `package.json` <!-- id: 2 -->
- [x] Update "New Prompt File" menu item group to `navigation@3` in `package.json` <!-- id: 3 -->
- [x] Update "Refresh Prompts" menu item group to `navigation@4` (or keep as is if it doesn't conflict) in `package.json` <!-- id: 4 -->
- [x] Implement `openspec-for-copilot.prompts.createAgentFile` command handler in `src/extension.ts` to execute `workbench.command.new.agent` <!-- id: 5 -->
- [x] Verify the button appears in the Prompts view title bar with the correct icon and order <!-- id: 6 -->
