import { commands } from "vscode";
import { ConfigManager } from "./config-manager";

export const sendPromptToChat = async (prompt: string): Promise<void> => {
	const configManager = ConfigManager.getInstance();
	const settings = configManager.getSettings();
	const language = settings.chatLanguage;

	let finalPrompt = prompt;
	if (language !== "English") {
		finalPrompt += `\n\n(Please respond in ${language}.)`;
	}

	await commands.executeCommand("workbench.action.chat.open", {
		query: finalPrompt,
	});
};
