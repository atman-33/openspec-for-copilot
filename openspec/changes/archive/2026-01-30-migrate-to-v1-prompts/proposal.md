# Migrate to OpenSpec v1 Prompt File References

## Summary

Migrate VSCode extension to reference OpenSpec v1 prompt files (`opsx-*.prompt.md`) instead of legacy prompt file names (`openspec-*.prompt.md`). This ensures compatibility with OpenSpec v1's new artifact-based workflow system.

## Context

OpenSpec has been updated to v1 with breaking changes in prompt file naming and structure:
- Old: `openspec-proposal.prompt.md`, `openspec-apply.prompt.md`, `openspec-archive.prompt.md`
- New: `opsx-new.prompt.md`, `opsx-apply.prompt.md`, `opsx-archive.prompt.md`

The new v1 prompt files are already in place at `.github/prompts/`, but the VSCode extension source code still references the old file names that no longer exist.

## Motivation

**Problem:**
- The extension attempts to read prompt files with old names that don't exist
- This causes file not found errors when users try to create specs, apply tasks, or archive changes
- The extension is incompatible with OpenSpec v1 standard naming

**Goals:**
1. Update all source code references from old to new prompt file names
2. Maintain backward compatibility with existing archived changes
3. Keep custom VSCode extension features (detailed-design, create-issue) intact

## Affected Components

### Source Files
1. **Create Spec Flow** - `src/features/spec/create-spec-input-controller.ts`
   - Currently references: `openspec-proposal.prompt.md`
   - Should reference: `opsx-new.prompt.md`

2. **Apply Tasks Flow** - `src/features/spec/spec-manager.ts`
   - Currently references: `openspec-apply.prompt.md`
   - Should reference: `opsx-apply.prompt.md`

3. **Archive Change Flow** - `src/activation/commands/register-spec-commands.ts`
   - Currently references: `openspec-archive.prompt.md`
   - Should reference: `opsx-archive.prompt.md`

### Specifications
- `openspec/specs/prompt-generation/spec.md` - Documents the Create Spec behavior

## Scope

**In Scope:**
- Update 3 file path references in source code
- Update specification documentation
- Verify test compatibility

**Out of Scope:**
- Full CLI integration (future enhancement)
- Dynamic schema support (future enhancement)
- Migration of archived changes (they remain as-is)
- Changes to agent files (`.github/agents/` - already v1 compatible)

## Implementation Approach

Simple file path string replacement in TypeScript source files. The v1 prompts are designed to work with CLI commands, but the extension currently reads them as templates, so they function similarly to the old versions for the extension's use case.

## Success Criteria

- Extension successfully reads all three v1 prompt files
- Create Spec command works without errors
- Apply Tasks command works without errors
- Archive Change command works without errors
- All existing tests pass

## Non-Goals

- This change does NOT implement full OpenSpec v1 CLI integration
- This change does NOT add dynamic schema support
- Custom extension features (`detailed-design.md`, GitHub issue creation) remain unchanged
