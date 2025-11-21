# Prompt Generation Spec

## ADDED Requirements

### Requirement: Dynamic Prompt Loading
The system MUST read the content of `.github/prompts/openspec-proposal.prompt.md` from the workspace root when generating the "Create Spec" prompt.

#### Scenario: File exists
Given the file `.github/prompts/openspec-proposal.prompt.md` exists in the workspace
When the user submits the "Create New Spec" form
Then the system reads the content of this file.

#### Scenario: File does not exist
Given the file `.github/prompts/openspec-proposal.prompt.md` does not exist
When the user submits the "Create New Spec" form
Then the system should probably fall back to the existing behavior or show an error. (Decision: Show error or fallback? User instruction implies strict usage. I will assume error or fallback to empty string + input, but better to error if strict compliance is needed. Let's assume we should try to read it, and if it fails, maybe fallback or error. For now, I'll implement reading it.)

### Requirement: Prompt Construction
The system MUST construct the final prompt by concatenating the content of `.github/prompts/openspec-proposal.prompt.md` and the user's input.

#### Scenario: Construct Prompt
Given the content of `.github/prompts/openspec-proposal.prompt.md` is "PROMPT_PREFIX"
And the user input formatted description is "USER_INPUT"
When the prompt is generated
Then the result is "PROMPT_PREFIX\n\nUSER_INPUT" (or similar separator).
