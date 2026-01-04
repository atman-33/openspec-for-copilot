import { commands } from "vscode";
import { CodexService } from "../services/codex-service";
import { ConfigManager } from "./config-manager";

export interface ChatContext {
	instructionType?:
		| "createSpec"
		| "startAllTask"
		| "archiveChange"
		| "runPrompt";
}

export const buildChatPrompt = (
	prompt: string,
	context?: ChatContext
): string => {
	const configManager = ConfigManager.getInstance();
	const settings = configManager.getSettings();
	const language = settings.chatLanguage;
	const customInstructions = settings.customInstructions;

	let finalPrompt = prompt;

	// Append global custom instruction
	if (customInstructions.global) {
		finalPrompt += `\n\n${customInstructions.global}`;
	}

	// Append specific custom instruction
	if (context?.instructionType) {
		const specificInstruction = customInstructions[context.instructionType];
		if (specificInstruction) {
			finalPrompt += `\n\n${specificInstruction}`;
		}
	}

	// Append language instruction
	if (language !== "English") {
		finalPrompt += `\n\n(Please respond in ${language}.)`;
	}

	return finalPrompt;
};

export const sendPromptToChat = async (
	prompt: string,
	context?: ChatContext
): Promise<void> => {
	const finalPrompt = buildChatPrompt(prompt, context);
	const configManager = ConfigManager.getInstance();
	const { aiAgent } = configManager.getSettings();

	if (aiAgent === "codex") {
		await CodexService.addPromptToThread(finalPrompt);
		return;
	}

	await commands.executeCommand("workbench.action.chat.open", {
		query: finalPrompt,
	});
};
