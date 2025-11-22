# Proposal: Add Custom Prompt Instructions

## Summary
Allow users to configure custom instructions (footers) that are automatically appended to prompts executed by the extension. This supports both global instructions (applied to all prompts) and specific instructions for key workflows (Create Spec, Start All Task, Prompt Execution).

## Motivation
Users often have specific requirements or context they want to include in every interaction with Copilot (e.g., "Always use Japanese", "Follow specific coding style"). Currently, they have to manually add this to every prompt or rely on the limited "Chat Language" setting. This feature provides a flexible way to inject custom context.

## Solution
- Add new configuration settings for global and specific custom instructions.
- Update the prompt runner to append these instructions before the language instruction.
- Ensure instructions are applied consistently across "Create Spec", "Start All Task", and "Prompt Execution" workflows.

## Risks
- Overlapping instructions might confuse Copilot if not ordered correctly.
- Users might add too much context, hitting token limits (though less likely with modern models).
