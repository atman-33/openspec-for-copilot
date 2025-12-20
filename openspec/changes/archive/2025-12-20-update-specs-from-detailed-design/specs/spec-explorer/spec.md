# Spec: Update Specs from Detailed Design

## Context
This spec defines the capability to update source documents (`proposal`, `tasks`, `specs`, `design`) based on the content of `detailed-design.md`.

## ADDED Requirements

### Requirement: Update Specs Command
The Spec Explorer SHALL provide a context menu command on change items to update source documents from the detailed design.

#### Scenario: Trigger Update
Given a change item with an existing `detailed-design.md`
When I right-click the change item
Then I should see "Update Specs from Detailed Design" in the context menu
And it should be positioned after "Create Detailed Design"

#### Scenario: Execute Update
Given I have selected "Update Specs from Detailed Design"
Then the extension reads `detailed-design.md` and all source documents (`proposal.md`, `tasks.md`, `design.md`, `specs/**/spec.md`)
And sends a prompt to Copilot Chat instructing it to update the source documents based on the detailed design

#### Scenario: Missing Detailed Design
Given a change item without a `detailed-design.md`
When I try to run "Update Specs from Detailed Design"
Then I should see an error message indicating that the detailed design document is missing
