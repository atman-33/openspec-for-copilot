# 📦 Changelog

---

## v0.5.0 2025-12-22

### Added

- add Create GitHub Issue command and prompt template

### Changed

- feature/create-issue-from-spec
- add Create GitHub Issue command and related documentation
- Merge pull request #17 from atman-33/version-bump/v0.4.1

## v0.4.1 2025-12-21

### Changed

- fix/create-spec-autosave
- Merge pull request #15 from atman-33/version-bump/v0.4.0

### Fixed

- implement autosave functionality in CreateSpecView

## v0.4.0 2025-12-21

### Added

- implement "Update Specs from Detailed Design" command and related functionality
- enhance extension services with URI support and add detailed design prompt template
- add command for creating detailed design and integrate into spec explorer
- hide missing change files in sidebar

### Changed

- feature/detailed-design
- enhance README with detailed design workflow and update specs instructions
- update guardrails in prompts to clarify output handling and user review steps
- streamline document path handling and update prompt composition in detailed design commands
- add "Create Detailed Design" and "Update Specs from Detailed Design" commands with associated documentation and specs
- add "Update Specs from Detailed Design" command and related documentation
- add unit tests for prompt bootstrapping and ensure no overwrite occurs
- Add steering commands and related services
- ensure detailed-design.md is scaffolded if missing and open for editing
- add detailed design command with context menu integration and prompt handling
- add proposal and specification for hiding missing change files in sidebar
- feature/hide-empty-changes
- add proposal and tasks for hiding missing change files in sidebar
- Merge pull request #12 from atman-33/version-bump/v0.3.3

### Fixed

- remove information message after sending prompt to Copilot Chat
- update prompt file references from 'openspec-add-detailed-design' to 'openspec-create-detailed-design'

## v0.3.3 2025-11-23

### Added

- implement "New Agent File" command and menu integration

### Changed

- feature/new-agent-file
- add "New Agent File" button to Prompts view with command integration and ordering
- add "New Agent File" button to Prompts view with command integration
- Merge pull request #10 from atman-33/version-bump/v0.3.2

## v0.3.2 2025-11-22

### Changed

- Merge remote-tracking branch 'origin/main'
- update screenshot images
- Merge pull request #9 from atman-33/version-bump/v0.3.1

## v0.3.1 2025-11-22

### Changed

- update icon image
- Merge remote-tracking branch 'origin/main'
- add Project Agents group and rename functionality in Prompts explorer
- Merge pull request #8 from atman-33/version-bump/v0.3.0

## v0.3.0 2025-11-22

### Added

- update SVG icon design for improved visual clarity
- add rename functionality for prompts in the explorer view

### Changed

- feature/improve-prompts-view
- add Project Agents group and rename functionality in Prompts explorer
- add project instructions display in Prompts view with separate grouping
- Merge pull request #6 from atman-33/version-bump/v0.2.1

## v0.2.1 2025-11-22

### Added

- add support for project instructions label in prompts explorer
- enhance PromptsExplorerProvider to include project instructions group and update related tests
- reorder sidebar views in Spec and Prompts Explorers

### Changed

- feature/show-github-instructions
- add design, proposal, spec, and tasks for displaying project instructions in Prompts view
- add display order requirements for Spec and Prompts Explorers
- add proposal and requirements for reordering sidebar views in Spec and Prompts Explorers
- Merge pull request #4 from atman-33/version-bump/v0.2.0

### Fixed

- update prompt and steering explorer descriptions for clarity

## v0.2.0 2025-11-22

### Added

- add support for custom instructions in prompts for GitHub Copilot integration

### Changed

- feature/prompt-custom-footer
- add custom instructions structure to ConfigManager tests
- implement custom prompt instructions injection for GitHub Copilot integration
- add support for custom prompt instructions in GitHub Copilot integration
- Merge pull request #2 from atman-33/version-bump/v0.1.7

## v0.1.7 2025-11-21

- Initial implementation of OpenSpec for Copilot features.

