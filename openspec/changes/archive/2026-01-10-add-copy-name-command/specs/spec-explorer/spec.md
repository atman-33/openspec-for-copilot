# spec-explorer Specification Delta

## ADDED Requirements

### Requirement: Copy Name Command
The Spec Explorer SHALL provide a context menu command to copy the name of a change or spec item to the system clipboard.

#### Scenario: Copy Change Name
- Given I am in the Specs view
- And there is a change item (e.g., `add-copy-name-command`)
- When I right-click on the change item
- And I select "Copy Name"
- Then the change name (e.g., `add-copy-name-command`) is copied to the system clipboard
- And a notification confirms "Copied: add-copy-name-command"

#### Scenario: Copy Spec Name
- Given I am in the Specs view
- And there is a spec item under "Current Specs" (e.g., `spec-explorer`)
- When I right-click on the spec item
- And I select "Copy Name"
- Then the spec name (e.g., `spec-explorer`) is copied to the system clipboard
- And a notification confirms "Copied: spec-explorer"

#### Scenario: Paste Copied Name in Chat
- Given I have copied a change or spec name via "Copy Name"
- When I focus on Copilot Chat or any text input
- And I paste (Ctrl+V / Cmd+V)
- Then the copied name appears as plain text
