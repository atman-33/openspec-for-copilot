## 1. Create Shared Utility Module

- [x] 1.1 Create `src/utils/openspec-prompt-utils.ts` with `PromptFileResult` interface
- [x] 1.2 Implement `readPromptFile()` function with V1 and legacy fallback logic
- [x] 1.3 Implement `createMigrationError()` helper function
- [x] 1.4 Implement `createDeprecationWarning()` helper function
- [x] 1.5 Create unit tests in `src/utils/openspec-prompt-utils.test.ts`

## 2. Update Command Handlers

- [x] 2.1 Update `src/features/spec/create-spec-input-controller.ts` to use `readPromptFile()`
- [x] 2.2 Update `src/features/spec/spec-manager.ts` to use `readPromptFile()`
- [x] 2.3 Update `src/activation/commands/register-spec-commands.ts` archive command to use `readPromptFile()`

## 3. Update Documentation

- [x] 3.1 Add "Migrating to OpenSpec v1" section to `README.md`
- [x] 3.2 Add migration steps and troubleshooting guide
- [x] 3.3 Update `CHANGELOG.md` with breaking change notice and new features

## 4. Testing

- [x] 4.1 Run unit tests for new utility module
- [x] 4.2 Run existing test suite to ensure no regressions
- [x] 4.3 Manual test: Trigger error with no prompt files present
- [x] 4.4 Manual test: Verify legacy file fallback with warning
- [x] 4.5 Manual test: Verify V1 files work without warnings
