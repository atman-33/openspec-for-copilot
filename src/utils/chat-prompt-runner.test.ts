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
			customInstructions: {
				global: "",
				createSpec: "",
				startAllTask: "",
				runPrompt: "",
			},
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
			customInstructions: {
				global: "",
				createSpec: "",
				startAllTask: "",
				runPrompt: "",
			},
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
			customInstructions: {
				global: "",
				createSpec: "",
				startAllTask: "",
				runPrompt: "",
			},
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

	it("should append global custom instruction", async () => {
		mockGetSettings.mockReturnValue({
			chatLanguage: "English",
			customInstructions: {
				global: "Global Context",
				createSpec: "",
				startAllTask: "",
				runPrompt: "",
			},
		});
		const prompt = "Test prompt";

		await sendPromptToChat(prompt);

		expect(commands.executeCommand).toHaveBeenCalledWith(
			"workbench.action.chat.open",
			{
				query: "Test prompt\n\nGlobal Context",
			}
		);
	});

	it("should append specific custom instruction", async () => {
		mockGetSettings.mockReturnValue({
			chatLanguage: "English",
			customInstructions: {
				global: "",
				createSpec: "Specific Context",
				startAllTask: "",
				runPrompt: "",
			},
		});
		const prompt = "Test prompt";

		await sendPromptToChat(prompt, { instructionType: "createSpec" });

		expect(commands.executeCommand).toHaveBeenCalledWith(
			"workbench.action.chat.open",
			{
				query: "Test prompt\n\nSpecific Context",
			}
		);
	});

	it("should append global and specific custom instructions in correct order", async () => {
		mockGetSettings.mockReturnValue({
			chatLanguage: "English",
			customInstructions: {
				global: "Global Context",
				createSpec: "Specific Context",
				startAllTask: "",
				runPrompt: "",
			},
		});
		const prompt = "Test prompt";

		await sendPromptToChat(prompt, { instructionType: "createSpec" });

		expect(commands.executeCommand).toHaveBeenCalledWith(
			"workbench.action.chat.open",
			{
				query: "Test prompt\n\nGlobal Context\n\nSpecific Context",
			}
		);
	});

	it("should append all instructions including language in correct order", async () => {
		mockGetSettings.mockReturnValue({
			chatLanguage: "Japanese",
			customInstructions: {
				global: "Global Context",
				createSpec: "Specific Context",
				startAllTask: "",
				runPrompt: "",
			},
		});
		const prompt = "Test prompt";

		await sendPromptToChat(prompt, { instructionType: "createSpec" });

		expect(commands.executeCommand).toHaveBeenCalledWith(
			"workbench.action.chat.open",
			{
				query:
					"Test prompt\n\nGlobal Context\n\nSpecific Context\n\n(Please respond in Japanese.)",
			}
		);
	});
});
