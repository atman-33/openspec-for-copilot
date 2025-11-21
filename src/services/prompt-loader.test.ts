import { beforeEach, describe, expect, it, vi } from "vitest";
import { PromptLoader } from "./prompt-loader";

// Mock the prompts module
vi.mock("../prompts/target", () => ({
	example: {
		frontmatter: {
			id: "example",
			name: "Example Prompt",
			version: "1.0.0",
			description: "An example prompt",
			variables: {
				name: { required: true },
			},
		},
		content: "Hello {{name}}!",
	},
}));

describe("PromptLoader", () => {
	let loader: PromptLoader;

	beforeEach(() => {
		// Force a new instance for each test and initialize it
		// biome-ignore lint/complexity/useLiteralKeys: ignore
		PromptLoader["instance"] = new (PromptLoader as any)();
		loader = PromptLoader.getInstance();
		loader.initialize();
	});

	// 1. Happy Path: Test that renderPrompt correctly renders a prompt.
	it("should render a prompt with the given variables", () => {
		const rendered = loader.renderPrompt("example", {
			name: "World",
		});
		expect(rendered).toBe("Hello World!");
	});

	// 2. Edge Case: Test that renderPrompt throws an error for missing required variables.
	it("should throw an error if a required variable is missing", () => {
		expect(() => loader.renderPrompt("example", {})).toThrow(
			"Variable validation failed: Missing required variable: name"
		);
	});

	// 3. Fail Safe / Mocks: Test that loadPrompt throws an error for a non-existent prompt.
	it("should throw an error when trying to load a non-existent prompt", () => {
		const promptId = "non-existent-prompt";
		expect(() => loader.loadPrompt(promptId)).toThrow(
			`Prompt not found: ${promptId}. Available prompts: example`
		);
	});
});
