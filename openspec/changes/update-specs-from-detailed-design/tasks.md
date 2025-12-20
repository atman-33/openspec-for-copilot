# Tasks: Update Specs from Detailed Design

- [x] 1. Register "Update Specs from Detailed Design" command in `package.json` (title: "Update Specs from Detailed Design", command: `openspec-for-copilot.spec.updateSpecsFromDetailedDesign`).
- [x] 2. Add "Update Specs from Detailed Design" to the Specs view item context menu for change items, ordered after "Create Detailed Design".
- [x] 3. Create the default prompt template at `src/resources/prompts/openspec-update-specs-from-detailed-design.prompt.md`.
- [x] 4. Implement the command handler `src/features/spec/commands/update-specs-from-detailed-design.ts` to gather context and send the prompt to Copilot Chat.
- [x] 5. Register the new command in `src/features/spec/register-commands.ts`.
