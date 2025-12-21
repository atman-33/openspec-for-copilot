# Tasks

## 1. Command + Menu Wiring
- [x] 1.1 Register a new command `openspec-for-copilot.spec.createDetailedDesign` in `package.json`.
- [x] 1.2 Add "Create Detailed Design" to the Specs view item context menu for change items, ordered above "Archive Change".

## 2. Prompt Bootstrapping
- [x] 2.1 On command execution, ensure `.github/prompts/openspec-create-detailed-design.prompt.md` exists; if missing, create it with a minimal starter prompt.
- [x] 2.2 Do not overwrite the prompt file if it already exists.

## 3. Prompt Execution + File Generation
- [x] 3.1 Collect inputs from the selected change:
  - `proposal.md`, `tasks.md`
  - `design.md` if present
  - all delta specs `openspec/changes/<change-id>/specs/**/spec.md`
- [x] 3.2 Invoke Copilot chat with the prompt content plus the collected inputs.
- [x] 3.3 Ensure `openspec/changes/<change-id>/detailed-design.md` exists (scaffold if missing) and open it so the user can paste the Copilot output.

## 4. Specs View Integration
- [x] 4.1 Update Specs tree provider so `detailed-design.md` appears under the change item when the file exists.
- [x] 4.2 Ensure clicking the item opens the file (consistent with Proposal/Tasks/Design behavior).

## 5. Validation
- [x] 5.1 Add/adjust unit tests for the tree provider change (showing `detailed-design.md` when present).
- [x] 5.2 Add/adjust unit tests for prompt bootstrapping (creates prompt only when missing).
- [x] 5.3 Run `npm run compile`.
- [x] 5.4 Run `openspec validate add-detailed-design-command --strict`.
