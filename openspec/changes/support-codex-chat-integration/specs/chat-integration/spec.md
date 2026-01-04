# Chat Integration Spec Delta

## ADDED Requirements

### Requirement: AI Agent Configuration
The extension MUST allow users to configure which AI agent to use for chat interactions.

#### Scenario: Default Configuration
- Given the user has not configured `openspec.aiAgent`
- When the extension reads the configuration
- Then the value MUST be `github-copilot`.

#### Scenario: Select Codex
- Given the user sets `openspec.aiAgent` to `codex`
- When the extension sends a prompt to chat
- Then the extension MUST use the Codex integration workflow.

### Requirement: Codex Integration Workflow
When the AI agent is set to `codex`, the extension MUST send prompts via the `chatgpt.addToThread` command using a temporary file.

#### Scenario: Send Prompt to Codex
- Given `openspec.aiAgent` is `codex`
- When the extension sends a prompt "Create a spec for X"
- Then a temporary file MUST be created at `~/.codex/.tmp/YYYYMMDD-<UUID>.md`.
- And the file content MUST be "Create a spec for X".
- And the file MUST be opened in the editor.
- And the entire content of the file MUST be selected.
- And the command `chatgpt.addToThread` MUST be executed.

#### Scenario: Temporary File Path
- The temporary file path MUST follow the pattern `~/.codex/.tmp/YYYYMMDD-<UUID>.md`.
- The directory `~/.codex/.tmp/` MUST be created if it does not exist.
