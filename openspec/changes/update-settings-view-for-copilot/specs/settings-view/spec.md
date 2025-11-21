# Settings View Spec

## ADDED Requirements

### Settings View Branding
The Settings view must reflect the new "OpenSpec for Copilot" branding.

#### Scenario: View Title
- **GIVEN** the extension is active
- **WHEN** the user opens the Settings view
- **THEN** the view welcome content should display "Configure OpenSpec for Copilot"

### MCP Configuration Access
Users must be able to easily access the MCP configuration file.

#### Scenario: Open MCP Config
- **GIVEN** the extension is active
- **WHEN** the user invokes the "Open MCP Config (mcp.json)" action (from the Settings view or Command Palette)
- **THEN** the extension should attempt to open `<User Folder>/AppData/Roaming/Code/User/mcp.json`
- **AND** if the file exists, it should be opened in the editor
- **AND** if the file does not exist, a warning should be shown

### Help Resource
Users must be directed to the correct documentation.

#### Scenario: Open Help
- **GIVEN** the extension is active
- **WHEN** the user invokes the "Help" action
- **THEN** the browser should open `https://github.com/atman-33/openspec-for-copilot#readme`
