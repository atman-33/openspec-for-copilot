# Add OpenSpec v1 Migration Guidance

## Summary

Enhance the extension to provide clear migration guidance when OpenSpec v1 prompt files are not found, while maintaining backward compatibility with legacy prompt files. This improves user experience during the breaking change migration from OpenSpec v0.x to v1.

## Context

Following the migration to OpenSpec v1 prompt file references (change: `migrate-to-v1-prompts`), users who haven't yet initialized OpenSpec v1 will encounter file not found errors. The current error messages are technical and don't guide users on how to resolve the issue.

OpenSpec v1 requires initialization to generate new prompt files:
```bash
npm install -g openspec@latest
openspec init
```

## Motivation

**Problem:**
- Users see cryptic "file not found" errors without understanding why
- No guidance on how to migrate from v0.x to v1
- Breaking change impacts existing users who haven't upgraded
- Extension appears broken rather than requiring migration

**Goals:**
1. Provide clear, actionable error messages when v1 prompt files are missing
2. Support legacy prompt files as fallback with deprecation warning
3. Guide users through OpenSpec v1 installation and initialization
4. Update documentation with migration guide

## Affected Components

### Source Code
1. **Error Message Helper** (new utility)
   - Create `src/utils/openspec-prompt-utils.ts`
   - Shared helper for consistent error/warning messages
   - File existence check with fallback logic

2. **Create Spec Controller** - `src/features/spec/create-spec-input-controller.ts`
   - Enhanced error handling with migration guidance
   - Fallback to legacy `openspec-proposal.prompt.md` with warning
   - Use shared utility

3. **Spec Manager** - `src/features/spec/spec-manager.ts`
   - Enhanced error handling for apply prompt
   - Fallback to legacy `openspec-apply.prompt.md` with warning
   - Use shared utility

4. **Archive Command** - `src/activation/commands/register-spec-commands.ts`
   - Enhanced error handling for archive prompt
   - Fallback to legacy `openspec-archive.prompt.md` with warning
   - Use shared utility

### Documentation
- **README.md**: Add migration guide section
- **CHANGELOG.md**: Document breaking change and migration steps

## Scope

**In Scope:**
- Create shared prompt file utility with fallback logic
- Update 3 command handlers to use new utility
- Implement detailed error messages with installation instructions
- Implement deprecation warnings for legacy files
- Update README with migration guide
- Update CHANGELOG

**Out of Scope:**
- Automatic OpenSpec CLI installation
- Automatic `openspec init` execution
- CLI version detection
- Interactive migration wizard

## Implementation Approach

### 1. Shared Utility Pattern

```typescript
// src/utils/openspec-prompt-utils.ts
export async function readPromptFile(
  workspaceUri: Uri, 
  v1Filename: string, 
  legacyFilename: string
): Promise<{ content: string; isLegacy: boolean }> {
  // Try v1 file first
  // If not found, try legacy file
  // If neither found, throw with detailed migration message
}

export function createMigrationErrorMessage(filename: string): string {
  // Detailed message with installation steps
}

export function createDeprecationWarning(legacyFile: string, v1File: string): string {
  // Warning message for legacy file usage
}
```

### 2. Error Message Format

**V1 File Not Found:**
```
OpenSpec v1 prompt files not found.

Required: .github/prompts/opsx-new.prompt.md

To migrate to OpenSpec v1:
1. Install OpenSpec CLI v1:
   npm install -g openspec@latest

2. Initialize OpenSpec v1 in your workspace:
   cd /path/to/workspace
   openspec init

This will generate the required v1 prompt files.

For more information: [link to migration guide in README]
```

**Legacy File Used (Warning):**
```
⚠️ Using legacy OpenSpec v0.x prompt file

Legacy: .github/prompts/openspec-proposal.prompt.md
Upgrade to: .github/prompts/opsx-new.prompt.md

Please migrate to OpenSpec v1:
  npm install -g openspec@latest
  openspec init

Legacy support will be removed in a future release.
```

### 3. README Migration Guide

Add section:
```markdown
## Migrating to OpenSpec v1

OpenSpec for Copilot now requires OpenSpec CLI v1...
```

## Success Criteria

- Users see clear migration instructions when v1 files are missing
- Extension falls back to legacy files if present
- Deprecation warnings appear when using legacy files
- README includes comprehensive migration guide
- All three commands (create, apply, archive) have consistent behavior
- Existing tests pass
- Manual testing confirms improved error messages

## Breaking Change Impact

This change **mitigates** the breaking change introduced in `migrate-to-v1-prompts`:
- Users with legacy files: Extension continues working with warnings
- Users without any files: Clear guidance on how to set up
- Users with v1 files: Normal operation (no change)

## Non-Goals

- This does NOT automate the migration process
- This does NOT detect OpenSpec CLI version
- This does NOT modify user's project files automatically
