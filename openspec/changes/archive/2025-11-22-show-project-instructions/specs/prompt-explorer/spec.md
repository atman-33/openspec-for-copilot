# Spec: Prompt Explorer

## ADDED Requirements

### Requirement: Project Instructions Display
The Prompts tree MUST include a `Project Instructions` group node that lists files from the `.github/instructions` directory.

#### Scenario: View Project Instructions
Given I have files in `.github/instructions`
When I open the Prompts view
Then I should see a "Project Instructions" group
And it should list the files from `.github/instructions`

## MODIFIED Requirements

### Requirement: Prompt Source Grouping
The Prompts tree MUST organize prompt items under `Global`, `Project Prompts`, and `Project Instructions` group nodes, in that order.

#### Scenario: View Project Prompts
Given I have files in `.github/prompts`
When I open the Prompts view
Then I should see a "Project Prompts" group
And it should list the files from `.github/prompts`
