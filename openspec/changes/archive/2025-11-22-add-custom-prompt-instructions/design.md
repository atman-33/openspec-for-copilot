# Design: Custom Prompt Instructions Injection

## Context
We need to inject user-defined custom instructions into prompts sent to GitHub Copilot. These instructions can be global (all prompts) or specific to a workflow (Create Spec, Start All Task, Run Prompt).

## Architecture

### Configuration
We will add the following settings to `package.json`:
- `openspec-for-copilot.customInstructions.global`: String (multiline)
- `openspec-for-copilot.customInstructions.createSpec`: String (multiline)
- `openspec-for-copilot.customInstructions.startAllTask`: String (multiline)
- `openspec-for-copilot.customInstructions.runPrompt`: String (multiline)

### Injection Logic
The `ChatPromptRunner` (specifically `sendPromptToChat`) is the central point for sending prompts. We will enhance it to accept an optional context parameter indicating the source of the prompt.

```typescript
export interface ChatContext {
    instructionType?: 'createSpec' | 'startAllTask' | 'runPrompt';
}

export const sendPromptToChat = async (prompt: string, context?: ChatContext): Promise<void> => {
    // ...
}
```

Inside `sendPromptToChat`:
1.  Retrieve the `global` custom instruction.
2.  If `context.instructionType` is provided, retrieve the corresponding specific instruction.
3.  Retrieve the `chatLanguage` setting.
4.  Construct the final prompt:
    ```
    [Original Prompt]
    
    [Specific Instruction (if any)]
    
    [Global Instruction (if any)]
    
    [Language Instruction (if not English)]
    ```
    *Note: The user specified "Custom instructions are written before the language specification". The order between Global and Specific is not strictly defined, but "Specific" usually refines "Global", so placing Specific before Global might be better if Global is generic. However, usually specific instructions are more important. Let's append them in order: Specific, then Global, then Language. Or Global then Specific. Let's go with Global then Specific, as Global sets the baseline.*
    
    Wait, if I have a global "Be concise" and a specific "Be verbose", the specific should win. In LLM prompts, later instructions often carry more weight. So `[Global] [Specific]` is likely better.
    
    Let's refine the order:
    `[Original Prompt] + \n\n + [Global Instruction] + \n\n + [Specific Instruction] + \n\n + [Language Instruction]`

### ConfigManager
Update `ConfigManager` to provide typed access to these new settings.

### Call Sites
Update the following call sites to pass the appropriate `instructionType`:
- `CreateSpecInputController`: pass `createSpec`
- `SpecManager.runOpenSpecApply`: pass `startAllTask`
- `extension.ts` (`prompts.run`): pass `runPrompt`

## Alternatives
- **Modify individual prompt templates**: This would require users to edit every prompt file, which is what we want to avoid.
- **Middleware pattern**: `ChatPromptRunner` is effectively acting as a middleware here.
