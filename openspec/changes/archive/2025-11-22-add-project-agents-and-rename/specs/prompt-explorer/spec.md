## ADDED Requirements
### Requirement: Project Agents Display
The Prompts tree MUST include a `Project Agents` group node that lists files located under `.github/agents`, mirroring the behaviors of `Project Instructions` items.

#### Scenario: View Project Agents
Given I have files in `.github/agents`
When I open the Prompts view
Then I should see a "Project Agents" group directly beneath "Project Instructions"
And it should list the files from `.github/agents`

### Requirement: Rename Prompt Command
The PROMPTS view context menu MUST expose a `Rename` command for prompt, instruction, and agent files, positioned above `Delete`, and it MUST rename the underlying file without overwriting other files.

#### Scenario: Rename Option Placement
Given the PROMPTS view is open
When the user right-clicks on any prompt, instruction, or agent file
Then the context menu shows "Rename" directly above "Delete"

#### Scenario: Rename File
Given the user selects "Rename" and enters a new valid filename
Then the command renames the underlying file on disk without overwriting an existing file
And the PROMPTS view refreshes to show the updated filename

## MODIFIED Requirements
### Requirement: Prompt Source Grouping
The Prompts tree MUST organize prompt items under `Global`, `Project Prompts`, `Project Instructions`, and `Project Agents` group nodes so each directory surfaces in its own section.

#### Scenario: View Project Prompts
Given I have files in `.github/prompts`, `.github/instructions`, or `.github/agents`
When I open the Prompts view
Then I should see "Global", "Project Prompts", "Project Instructions", and "Project Agents" groups
And the files from each directory appear under their matching group

### Requirement: Display Order
The Prompts Explorer SHALL display the group nodes in the following order: `Global`, `Project Prompts`, `Project Instructions`, `Project Agents`.

#### Scenario: Default View
Given the Prompts Explorer is opened
When the tree view is rendered
Then "Global" appears first, followed by "Project Prompts", "Project Instructions", and "Project Agents" in that order
