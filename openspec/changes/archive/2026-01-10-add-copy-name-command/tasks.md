# Tasks: Add Copy Name Command

## 1. Package.json Updates
- [x] 1.1 Add `openspec-for-copilot.spec.copyName` command definition with title "Copy Name" and clipboard icon
- [x] 1.2 Add context menu contribution for `change` items (`viewItem == change`)
- [x] 1.3 Add context menu contribution for `spec` items (`viewItem == spec`)

## 2. Command Implementation
- [x] 2.1 Register `openspec-for-copilot.spec.copyName` command in `register-spec-commands.ts`
- [x] 2.2 Extract item name from `item.specName` or `item.label`
- [x] 2.3 Use `vscode.env.clipboard.writeText()` to copy to clipboard
- [x] 2.4 Show info notification confirming the copied name

## 3. Validation
- [ ] 3.1 Test copying change name from context menu
- [ ] 3.2 Test copying spec name from context menu
- [ ] 3.3 Verify copied text can be pasted in Copilot Chat
