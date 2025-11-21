import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { commands } from "vscode";
import { sendPromptToChat } from "./chat-prompt-runner";

describe("chat-prompt-runner", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should send the prompt to GitHub Copilot chat", async () => {
		const prompt = "Test prompt";

		await sendPromptToChat(prompt);

		expect(commands.executeCommand).toHaveBeenCalledWith(
			"workbench.action.chat.open",
			{
				query: prompt,
			}
		);
	});
});
