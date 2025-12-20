import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ExtensionContext } from "vscode";
import { Uri, workspace } from "vscode";
import { SpecExplorerProvider } from "./spec-explorer-provider";
import type { SpecManager } from "../features/spec/spec-manager";

describe("SpecExplorerProvider", () => {
	let provider: SpecExplorerProvider;
	const context = {
		extensionUri: Uri.file("/fake/extension"),
	} as ExtensionContext;
	let specManager: SpecManager;

	beforeEach(() => {
		vi.clearAllMocks();
		specManager = {
			getSpecs: vi.fn().mockResolvedValue([]),
			getChanges: vi.fn().mockResolvedValue([]),
			getChangeSpecs: vi.fn().mockResolvedValue([]),
		} as unknown as SpecManager;

		provider = new SpecExplorerProvider(context);
		provider.setSpecManager(specManager);

		// Mock workspace folders
		(workspace as any).workspaceFolders = [
			{ uri: Uri.file("/fake/workspace") },
		];
	});

	it("hides missing change files", async () => {
		const changeName = "test-change";
		vi.mocked(specManager.getChanges).mockResolvedValue([changeName]);

		// Mock fs.stat to throw for missing files
		vi.mocked(workspace.fs.stat).mockImplementation((uri) => {
			const fsPath = uri.fsPath;
			if (fsPath.endsWith("proposal.md")) {
				return Promise.resolve({} as any); // Exists
			}
			if (fsPath.endsWith("tasks.md")) {
				return Promise.reject(new Error("File not found")); // Missing
			}
			if (fsPath.endsWith("design.md")) {
				return Promise.resolve({} as any); // Exists
			}
			if (fsPath.endsWith("detailed-design.md")) {
				return Promise.resolve({} as any); // Exists
			}
			return Promise.resolve({} as any);
		});

		// Get root items
		const rootItems = await provider.getChildren();
		const changesGroup = rootItems.find(
			(item) => item.contextValue === "group-changes"
		);
		expect(changesGroup).toBeDefined();

		// Get changes
		const changes = await provider.getChildren(changesGroup);
		expect(changes).toHaveLength(1);
		const changeItem = changes[0];
		expect(changeItem.label).toBe(changeName);

		// Get change details
		const changeDetails = await provider.getChildren(changeItem);

		// Verify items
		const labels = changeDetails.map((item) => item.label);
		expect(labels).toContain("Proposal");
		expect(labels).not.toContain("Tasks");
		expect(labels).toContain("Design");
		expect(labels).toContain("Detailed Design");
		expect(labels).toContain("Specs");
	});
});
