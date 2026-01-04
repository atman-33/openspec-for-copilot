# chat-integration Specification

## Purpose
TBD - created by archiving change add-chat-language-setting. Update Purpose after archive.
## Requirements
### Requirement: Append Language Instruction
All prompts sent to GitHub Copilot via OpenSpec commands MUST include an instruction to respond in the configured language.

#### Scenario: Send Prompt in English (Default)
- Given the `chatLanguage` setting is `en`
- When the user executes a command that sends a prompt to chat (e.g., "Run Prompt", "Create Spec")
- Then the prompt text sent to Copilot should NOT include a specific language instruction (or explicitly request English if needed to override context).
- *Refinement*: Since Copilot defaults to English, we can omit the instruction for `en` to save tokens, or add "Please respond in English" to be explicit. For this iteration, we will omit it for `en` unless testing shows otherwise.

#### Scenario: Send Prompt in Japanese
- Given the `chatLanguage` setting is `ja`
- When the user executes a command that sends a prompt to chat
- Then the prompt text sent to Copilot should end with the directive "Please respond in Japanese."

#### Scenario: Send Prompt in Other Languages
- Given the `chatLanguage` setting is set to another supported language (e.g., `es` for Spanish)
- When the user executes a command that sends a prompt to chat
- Then the prompt text sent to Copilot should end with the directive "Please respond in Spanish."

#### Scenario: Centralized Handling
- Given the developer adds a new feature that uses `sendPromptToChat`
- When the feature is used
- Then the language instruction should be applied automatically without extra code in the new feature.

### Requirement: Inject Custom Instructions
The `sendPromptToChat` utility MUST append configured custom instructions to the prompt before the language instruction.

#### Scenario: Specific instruction only (Archive Change)
- Given the user has configured a specific instruction "Specific Context" for "Archive Change"
- And no global instruction is configured
- When an "Archive Change" prompt "Archive this change" is sent
- Then the final prompt sent to Copilot is "Archive this change\n\nSpecific Context\n\n(Please respond in ...)"

#### Scenario: Global and Specific instructions (Archive Change)
- Given the user has configured a global instruction "Global Context"
- And a specific instruction "Specific Context" for "Archive Change"
- When an "Archive Change" prompt "Archive this change" is sent
- Then the final prompt sent to Copilot is "Archive this change\n\nGlobal Context\n\nSpecific Context\n\n(Please respond in ...)"

#### Scenario: Order of injection (unchanged)
- The order MUST be: Original Prompt -> Global Instruction -> Specific Instruction -> Language Instruction.

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

### Requirement: AI Agent Configuration
The extension MUST allow users to configure which AI agent to use for chat interactions.

#### Scenario: Default Configuration
- Given the user has not configured `openspec-for-copilot.aiAgent`
- When the extension reads the configuration
- Then the value MUST be `github-copilot`.

#### Scenario: Select Codex
- Given the user sets `openspec-for-copilot.aiAgent` to `codex`
- When the extension sends a prompt to chat
- Then the extension MUST use the Codex integration workflow.

### Requirement: Codex Integration Workflow
When the AI agent is set to `codex`, the extension MUST send prompts via the `chatgpt.addToThread` command using a temporary file.

#### Scenario: Send Prompt to Codex
- Given `openspec-for-copilot.aiAgent` is `codex`
- When the extension sends a prompt "Create a spec for X"
- Then a temporary file MUST be created at `~/.codex/.tmp/YYYYMMDD-<UUID>.md`.
- And the file content MUST be "Create a spec for X".
- And the file MUST be opened in the editor.
- And the entire content of the file MUST be selected.
- And the command `chatgpt.addToThread` MUST be executed.

#### Scenario: Temporary File Path
- The temporary file path MUST follow the pattern `~/.codex/.tmp/YYYYMMDD-<UUID>.md`.
- The directory `~/.codex/.tmp/` MUST be created if it does not exist.

