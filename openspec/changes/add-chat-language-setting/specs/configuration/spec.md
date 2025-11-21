# Spec: Chat Language Configuration

## ADDED Requirements

### Requirement: Configure Chat Language
The user must be able to select their preferred language for Copilot chat interactions via VS Code settings.

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
