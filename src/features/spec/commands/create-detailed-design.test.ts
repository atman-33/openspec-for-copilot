import { beforeEach, describe, expect, it, vi } from "vitest";
import { Uri, window, workspace } from "vscode";
import { createDetailedDesignCommandHandler } from "./create-detailed-design";

vi.mock("../../../utils/chat-prompt-runner", () => ({
	sendPromptToChat: vi.fn(() => Promise.resolve()),
}));

describe("createDetailedDesignCommandHandler", () => {
	beforeEach(() => {
		vi.clearAllMocks();

		// Ensure the VS Code fs mock supports readFile for this suite.
		(workspace.fs as any).readFile = vi.fn();

		(workspace as any).workspaceFolders = [
			{
				uri: Uri.file("/fake/workspace"),
			},
		] as any;

		workspace.openTextDocument = vi.fn(async () => ({}) as any);
		(window as any).showTextDocument = vi.fn(async () => ({}) as any);
	});

	it("bootstraps the prompt from extension resources only when missing", async () => {
		const wsUri = workspace.workspaceFolders?.[0]?.uri as any;
		const promptsDir = Uri.joinPath(wsUri, ".github", "prompts");
		const promptPath = Uri.joinPath(
			promptsDir,
			"openspec-create-detailed-design.prompt.md"
		);
		const changeId = "add-detailed-design-command";
		const changeBase = Uri.joinPath(wsUri, "openspec", "changes", changeId);
		const proposalPath = Uri.joinPath(changeBase, "proposal.md");
		const tasksPath = Uri.joinPath(changeBase, "tasks.md");
		const outputPath = Uri.joinPath(changeBase, "detailed-design.md");

		const extensionUri = Uri.file("/fake/extension");
		const templateUri = Uri.joinPath(
			extensionUri,
			"src",
			"resources",
			"prompts",
			"openspec-create-detailed-design.prompt.md"
		);

		const templateBytes = new TextEncoder().encode("TEMPLATE\n");
		const proposalBytes = new TextEncoder().encode("# proposal\n");
		const tasksBytes = new TextEncoder().encode("# tasks\n");

		(workspace.fs.stat as any).mockImplementation((uri: any) => {
			if (uri.fsPath === promptPath.fsPath) {
				throw new Error("missing");
			}
			if (uri.fsPath === outputPath.fsPath) {
				throw new Error("missing");
			}
			return {} as any;
		});

		(workspace.fs.readFile as any).mockImplementation((uri: any) => {
			if (uri.fsPath === templateUri.fsPath) {
				return templateBytes;
			}
			if (uri.fsPath === promptPath.fsPath) {
				return templateBytes;
			}
			if (uri.fsPath === proposalPath.fsPath) {
				return proposalBytes;
			}
			if (uri.fsPath === tasksPath.fsPath) {
				return tasksBytes;
			}
			throw new Error(`Unexpected readFile: ${uri.fsPath}`);
		});

		const outputChannel = { appendLine: vi.fn() } as any;
		const specManager = { getChangeSpecs: vi.fn(async () => []) } as any;
		const services = {
			extensionUri,
			outputChannel,
			specManager,
		} as any;

		const specExplorer = { refresh: vi.fn() } as any;
		const handler = createDetailedDesignCommandHandler(services, specExplorer);

		await handler({ specName: changeId });

		expect(workspace.fs.createDirectory).toHaveBeenCalledWith(
			expect.objectContaining({ fsPath: promptsDir.fsPath })
		);
		const readFilePaths = (workspace.fs.readFile as any).mock.calls.map(
			([uri]: any[]) => uri.fsPath
		);
		expect(readFilePaths).toContain(templateUri.fsPath);

		const promptWrites = (workspace.fs.writeFile as any).mock.calls.filter(
			([uri]: any[]) => uri.fsPath === promptPath.fsPath
		);
		expect(promptWrites).toHaveLength(1);
		expect(promptWrites[0][1]).toEqual(templateBytes);
	});

	it("does not overwrite the prompt if it already exists", async () => {
		const wsUri = workspace.workspaceFolders?.[0]?.uri as any;
		const promptsDir = Uri.joinPath(wsUri, ".github", "prompts");
		const promptPath = Uri.joinPath(
			promptsDir,
			"openspec-create-detailed-design.prompt.md"
		);
		const changeId = "add-detailed-design-command";
		const changeBase = Uri.joinPath(wsUri, "openspec", "changes", changeId);
		const proposalPath = Uri.joinPath(changeBase, "proposal.md");
		const tasksPath = Uri.joinPath(changeBase, "tasks.md");
		const outputPath = Uri.joinPath(changeBase, "detailed-design.md");

		const extensionUri = Uri.file("/fake/extension");
		const templateUri = Uri.joinPath(
			extensionUri,
			"src",
			"resources",
			"prompts",
			"openspec-create-detailed-design.prompt.md"
		);

		const existingPromptBytes = new TextEncoder().encode("EXISTING\n");
		const proposalBytes = new TextEncoder().encode("# proposal\n");
		const tasksBytes = new TextEncoder().encode("# tasks\n");

		(workspace.fs.stat as any).mockImplementation((uri: any) => {
			if (uri.fsPath === promptPath.fsPath) {
				return {} as any;
			}
			if (uri.fsPath === outputPath.fsPath) {
				throw new Error("missing");
			}
			return {} as any;
		});

		(workspace.fs.readFile as any).mockImplementation((uri: any) => {
			if (uri.fsPath === promptPath.fsPath) {
				return existingPromptBytes;
			}
			if (uri.fsPath === proposalPath.fsPath) {
				return proposalBytes;
			}
			if (uri.fsPath === tasksPath.fsPath) {
				return tasksBytes;
			}
			if (uri.fsPath === templateUri.fsPath) {
				throw new Error("template should not be read");
			}
			throw new Error(`Unexpected readFile: ${uri.fsPath}`);
		});

		const outputChannel = { appendLine: vi.fn() } as any;
		const specManager = { getChangeSpecs: vi.fn(async () => []) } as any;
		const services = {
			extensionUri,
			outputChannel,
			specManager,
		} as any;

		const specExplorer = { refresh: vi.fn() } as any;
		const handler = createDetailedDesignCommandHandler(services, specExplorer);

		await handler({ specName: changeId });

		expect(workspace.fs.createDirectory).not.toHaveBeenCalledWith(promptsDir);
		const readFilePaths = (workspace.fs.readFile as any).mock.calls.map(
			([uri]: any[]) => uri.fsPath
		);
		expect(readFilePaths).not.toContain(templateUri.fsPath);

		const promptWrites = (workspace.fs.writeFile as any).mock.calls.filter(
			([uri]: any[]) => uri.fsPath === promptPath.fsPath
		);
		expect(promptWrites).toHaveLength(0);
	});
});
