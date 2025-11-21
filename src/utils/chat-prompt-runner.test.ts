import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { commands } from "vscode";
import { sendPromptToChat } from "./chat-prompt-runner";
import { ConfigManager } from "./config-manager";

// Mock ConfigManager
vi.mock("./config-manager", () => ({
	ConfigManager: {
		getInstance: vi.fn(),
	},
}));

describe("chat-prompt-runner", () => {
	const mockGetSettings = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		// Setup default mock behavior
		vi.mocked(ConfigManager.getInstance).mockReturnValue({
			getSettings: mockGetSettings,
		} as any);
		mockGetSettings.mockReturnValue({
			chatLanguage: "English",
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should send the prompt to GitHub Copilot chat without modification when language is English", async () => {
		const prompt = "Test prompt";

		await sendPromptToChat(prompt);

		expect(commands.executeCommand).toHaveBeenCalledWith(
			"workbench.action.chat.open",
			{
				query: prompt,
			}
		);
	});

	it("should append Japanese instruction when language is Japanese", async () => {
		mockGetSettings.mockReturnValue({
			chatLanguage: "Japanese",
		});
		const prompt = "Test prompt";

		await sendPromptToChat(prompt);

		expect(commands.executeCommand).toHaveBeenCalledWith(
			"workbench.action.chat.open",
			{
				query: "Test prompt\n\n(Please respond in Japanese.)",
			}
		);
	});

	it("should append Spanish instruction when language is Spanish", async () => {
		mockGetSettings.mockReturnValue({
			chatLanguage: "Spanish",
		});
		const prompt = "Test prompt";

		await sendPromptToChat(prompt);

		expect(commands.executeCommand).toHaveBeenCalledWith(
			"workbench.action.chat.open",
			{
				query: "Test prompt\n\n(Please respond in Spanish.)",
			}
		);
	});
});
