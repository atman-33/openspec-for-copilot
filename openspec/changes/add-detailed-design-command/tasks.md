# Tasks

## 1. Command + Menu Wiring
- [ ] 1.1 Register a new command `openspec-for-copilot.spec.createDetailedDesign` in `package.json`.
- [ ] 1.2 Add "Create Detailed Design" to the Specs view item context menu for change items, ordered above "Archive Change".

## 2. Prompt Bootstrapping
- [ ] 2.1 On command execution, ensure `.github/prompts/openspec-add-detailed-design.prompt.md` exists; if missing, create it with a minimal starter prompt.
- [ ] 2.2 Do not overwrite the prompt file if it already exists.

## 3. Prompt Execution + File Generation
- [ ] 3.1 Collect inputs from the selected change:
  - `proposal.md`, `tasks.md`
  - `design.md` if present
  - all delta specs `openspec/changes/<change-id>/specs/**/spec.md`
- [ ] 3.2 Invoke Copilot chat with the prompt content plus the collected inputs.
- [ ] 3.3 Write the resulting detailed design to `openspec/changes/<change-id>/detailed-design.md`.

## 4. Specs View Integration
- [ ] 4.1 Update Specs tree provider so `detailed-design.md` appears under the change item when the file exists.
- [ ] 4.2 Ensure clicking the item opens the file (consistent with Proposal/Tasks/Design behavior).

## 5. Validation
- [ ] 5.1 Add/adjust unit tests for the tree provider change (showing `detailed-design.md` when present).
- [ ] 5.2 Add/adjust unit tests for prompt bootstrapping (creates prompt only when missing).
- [ ] 5.3 Run `npm run compile`.
- [ ] 5.4 Run `openspec validate add-detailed-design-command --strict`.
