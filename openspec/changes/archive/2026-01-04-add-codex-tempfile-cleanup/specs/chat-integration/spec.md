# Chat Integration Spec Delta

## ADDED Requirements

### Requirement: Codex Temp File Retention
When Codex mode writes prompt files under `~/.codex/.tmp/`, the extension MUST delete old Markdown files to prevent unbounded growth.

#### Scenario: Cleanup Old Files
- Given `openspec-for-copilot.aiAgent` is `codex`
- And there are `.md` files in `~/.codex/.tmp/` older than 7 days
- When the extension sends a prompt via Codex
- Then the extension MUST delete those old `.md` files on a best-effort basis.

#### Scenario: Do Not Delete Recent Files
- Given `openspec-for-copilot.aiAgent` is `codex`
- And there are `.md` files in `~/.codex/.tmp/` newer than 7 days
- When the extension sends a prompt via Codex
- Then the extension MUST NOT delete those recent `.md` files.
