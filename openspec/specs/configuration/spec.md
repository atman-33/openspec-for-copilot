# configuration Specification

## Purpose
TBD - created by archiving change add-chat-language-setting. Update Purpose after archive.
## Requirements
### Requirement: Configure Chat Language
The user MUST be able to select their preferred language for Copilot chat interactions via VS Code settings.

#### Scenario: Default Setting
- Given the user has not modified the extension settings
- When they check the `openspec-for-copilot.chatLanguage` setting
- Then the value should be `en` (English)

#### Scenario: Change to Japanese
- Given the user opens VS Code settings
- When they search for "OpenSpec Chat Language"
- And they select "Japanese" (ja) from the dropdown
- Then the setting `openspec-for-copilot.chatLanguage` is updated to `ja`

#### Scenario: Support Multiple Languages
- The setting should support a list of common languages including but not limited to:
  - English (en)
  - Japanese (ja)
  - Spanish (es)
  - French (fr)
  - German (de)
  - Chinese (Simplified) (zh-cn)
  - Korean (ko)
  - Italian (it)
  - Portuguese (Brazil) (pt-br)

#### Scenario: Invalid Value
- Given the user manually edits `settings.json`
- When they set `openspec-for-copilot.chatLanguage` to an unsupported value (e.g., "xx")
- Then VS Code should show a validation warning (restricted by enum)

### Requirement: Global Custom Instruction Setting
The extension MUST provide a configuration setting for a global custom instruction that applies to all prompts.

#### Scenario: User configures global instruction
- Given the user opens VS Code settings
- When they search for "openspec custom instructions"
- Then they see a "Global" setting
- And they can enter a multiline string

### Requirement: Specific Custom Instruction Settings
The extension MUST provide configuration settings for specific custom instructions for "Create Spec", "Start All Task", and "Run Prompt".

#### Scenario: User configures specific instructions
- Given the user opens VS Code settings
- When they search for "openspec custom instructions"
- Then they see settings for "Create Spec", "Start All Task", and "Run Prompt"
- And they can enter multiline strings for each

