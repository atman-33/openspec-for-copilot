import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ExtensionContext } from "vscode";
import { FileType, Uri, window, workspace } from "vscode";
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
	const agentsRoot = "/fake/workspace/.github/agents";

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
		vi.mocked(workspace.fs.rename).mockReset();
		vi.mocked(workspace.fs.rename).mockResolvedValue();
		vi.mocked(window.showInputBox).mockReset();

		provider = new PromptsExplorerProvider(context);
	});

	it("returns all prompt groups at the root", async () => {
		const rootItems = await provider.getChildren();
		expect(rootItems).toHaveLength(4);
		const [
			globalGroup,
			projectPromptsGroup,
			projectInstructionsGroup,
			projectAgentsGroup,
		] = rootItems;

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

		expect(projectAgentsGroup.label).toBe("Project Agents");
		expect(projectAgentsGroup.contextValue).toBe("prompt-group-project-agents");
		expect(projectAgentsGroup.description).toBe(".github/agents");
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

	it("lists project agents within the project agents group", async () => {
		vi.mocked(workspace.fs.readDirectory).mockImplementation((uri) => {
			if (uri.fsPath === agentsRoot) {
				return Promise.resolve([["agent.md", FileType.File]] as any);
			}
			return Promise.resolve([] as any);
		});

		const rootItems = await provider.getChildren();
		const projectAgentsGroup = rootItems[3];
		const agents = await provider.getChildren(projectAgentsGroup);

		expect(agents.map((item) => item.label)).toEqual(["agent.md"]);
		expect(agents.every((item) => item.contextValue === "prompt")).toBe(true);
		expect(agents.every((item) => item.source === "project-agents")).toBe(true);
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

	it("renames a prompt file when the rename command succeeds", async () => {
		const item = {
			resourceUri: Uri.file(`${projectRoot}/example.md`),
		};
		vi.mocked(window.showInputBox).mockResolvedValue("renamed.md");
		const refreshSpy = vi.spyOn(provider, "refresh");

		await provider.renamePrompt(item as any);

		expect(workspace.fs.rename).toHaveBeenCalledWith(
			item.resourceUri,
			expect.objectContaining({
				fsPath: `${projectRoot}/renamed.md`,
			}),
			{ overwrite: false }
		);
		expect(refreshSpy).toHaveBeenCalled();
	});
});
