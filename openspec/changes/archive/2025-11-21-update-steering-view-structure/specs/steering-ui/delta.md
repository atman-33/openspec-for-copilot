# steering-ui Delta

## MODIFIED Requirements

### Requirement: Steering Tree View
The extension MUST display a "Steering" view that lists global and project-level instruction files.

#### Scenario: View Structure
- **GIVEN** the user has opened the Steering view
- **THEN** it displays "Global Instructions" pointing to `~/.github/copilot-instructions.md`
- **AND** it displays "Project Instructions" containing:
    - `Copilot Instructions` (`.github/copilot-instructions.md`) if it exists
    - `Agent Instructions` (`openspec/AGENTS.md`) if it exists
    - `Root Instructions` (`AGENTS.md`) if it exists
- **AND** it displays "Project Spec" containing:
    - `Project Definition` (`openspec/project.md`) if it exists

#### Scenario: Create Global Rule
- **GIVEN** the Global Instructions file does not exist
- **WHEN** the user clicks "Create Global Rule" (or equivalent action)
- **THEN** it creates `~/.github/copilot-instructions.md`

#### Scenario: Create Project Rule
- **GIVEN** no project rule exists
- **WHEN** the user clicks "Create Project Rule"
- **THEN** it creates `openspec/AGENTS.md`
