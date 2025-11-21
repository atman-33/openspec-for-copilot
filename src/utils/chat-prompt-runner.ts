import { commands } from "vscode";

export const sendPromptToChat = async (prompt: string): Promise<void> => {
	await commands.executeCommand("workbench.action.chat.open", {
		query: prompt,
	});
};
