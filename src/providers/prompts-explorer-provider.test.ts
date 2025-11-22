import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ExtensionContext } from "vscode";
import { FileType, Uri, workspace } from "vscode";
import { PromptsExplorerProvider } from "./prompts-explorer-provider";
import { ConfigManager } from "../utils/config-manager";

vi.mock("os", () => ({
	homedir: vi.fn(() => "/home/test"),
	release: vi.fn(() => "release"),
	platform: vi.fn(() => "linux"),
}));
vi.mock("../utils/platform-utils", () => ({
	isWindowsOrWsl: vi.fn(() => false),
	getVSCodeUserDataPath: vi.fn(),
}));

describe("PromptsExplorerProvider", () => {
	let provider: PromptsExplorerProvider;
	const context = {
		extensionUri: Uri.file("/fake/extension"),
	} as ExtensionContext;
	const projectRoot = "/fake/workspace/.github/prompts";
	const globalRoot = "/home/test/.github/prompts";

	beforeEach(() => {
		vi.clearAllMocks();
		// Reset ConfigManager singleton between tests
		// biome-ignore lint/complexity/useLiteralKeys: accessing private test helper
		(ConfigManager as any)["instance"] = undefined;
		// Provide deterministic relative path handling for prompt descriptions
		(workspace as any).asRelativePath = vi.fn((uri: { fsPath: string }) =>
			uri.fsPath.startsWith(`${projectRoot}/`)
				? uri.fsPath.replace(`${projectRoot}/`, "")
				: uri.fsPath
		);
		vi.mocked(workspace.fs.readDirectory).mockReset();
		vi.mocked(workspace.fs.readDirectory).mockResolvedValue([] as any);

		provider = new PromptsExplorerProvider(context);
	});

	it("returns global, project prompts, and project instructions groups at the root", async () => {
		const rootItems = await provider.getChildren();
		expect(rootItems).toHaveLength(3);
		const [globalGroup, projectPromptsGroup, projectInstructionsGroup] =
			rootItems;

		expect(globalGroup.label).toBe("Global");
		expect(globalGroup.contextValue).toBe("prompt-group-global");
		expect(globalGroup.description).toBe(globalRoot);

		expect(projectPromptsGroup.label).toBe("Project Prompts");
		expect(projectPromptsGroup.contextValue).toBe("prompt-group-project");
		expect(projectPromptsGroup.description).toBe(".github/prompts");

		expect(projectInstructionsGroup.label).toBe("Project Instructions");
		expect(projectInstructionsGroup.contextValue).toBe(
			"prompt-group-project-instructions"
		);
		expect(projectInstructionsGroup.description).toBe(".github/instructions");
	});

	it("lists project prompts within the project prompts group", async () => {
		vi.mocked(workspace.fs.readDirectory).mockImplementation((uri) => {
			if (uri.fsPath === projectRoot) {
				return Promise.resolve([
					["alpha.md", FileType.File],
					["nested", FileType.Directory],
				] as any);
			}
			if (uri.fsPath === `${projectRoot}/nested`) {
				return Promise.resolve([["beta.md", FileType.File]] as any);
			}
			return Promise.resolve([] as any);
		});

		const [, projectPromptsGroup] = await provider.getChildren();
		const projectPrompts = await provider.getChildren(projectPromptsGroup);

		expect(projectPrompts.map((item) => item.label)).toEqual([
			"alpha.md",
			"beta.md",
		]);
		expect(projectPrompts.every((item) => item.contextValue === "prompt")).toBe(
			true
		);
		expect(
			projectPrompts.every((item) => item.source === "project-prompts")
		).toBe(true);
	});

	it("lists project instructions within the project instructions group", async () => {
		const instructionsRoot = "/fake/workspace/.github/instructions";
		vi.mocked(workspace.fs.readDirectory).mockImplementation((uri) => {
			if (uri.fsPath === instructionsRoot) {
				return Promise.resolve([["guide.md", FileType.File]] as any);
			}
			return Promise.resolve([] as any);
		});

		const [, , projectInstructionsGroup] = await provider.getChildren();
		const instructions = await provider.getChildren(projectInstructionsGroup);

		expect(instructions.map((item) => item.label)).toEqual(["guide.md"]);
		expect(instructions.every((item) => item.contextValue === "prompt")).toBe(
			true
		);
		expect(
			instructions.every((item) => item.source === "project-instructions")
		).toBe(true);
	});

	it("shows an empty state when the global directory is missing", async () => {
		vi.mocked(workspace.fs.readDirectory).mockImplementation((uri) => {
			if (uri.fsPath.startsWith(globalRoot)) {
				return Promise.reject(new Error("missing"));
			}
			return Promise.resolve([] as any);
		});

		const [globalGroup] = await provider.getChildren();
		const globalPrompts = await provider.getChildren(globalGroup);

		expect(globalPrompts).toHaveLength(1);
		expect(globalPrompts[0].label).toBe("No prompts found");
		expect(globalPrompts[0].contextValue).toBe("prompts-empty");
	});
});
