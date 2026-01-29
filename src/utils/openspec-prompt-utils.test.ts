import { describe, expect, it, vi, beforeEach } from "vitest";
import { Uri, window, workspace } from "vscode";
import {
	createDeprecationWarning,
	createMigrationError,
	readPromptFile,
} from "./openspec-prompt-utils";

describe("openspec-prompt-utils", () => {
	const workspaceUri = Uri.file("/fake/workspace");
	const v1File = "opsx-new.prompt.md";
	const legacyFile = "openspec-proposal.prompt.md";
	const createNotFoundError = () =>
		Object.assign(new Error("missing"), {
			code: "FileNotFound",
			name: "FileNotFound",
		});

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(workspace.openTextDocument).mockResolvedValue(
			{} as unknown as import("vscode").TextDocument
		);
		vi.mocked(window.showTextDocument).mockResolvedValue(
			{} as unknown as import("vscode").TextEditor
		);
	});

	it("returns v1 prompt content when v1 file exists", async () => {
		const v1Path = Uri.joinPath(workspaceUri, ".github", "prompts", v1File);
		vi.mocked(workspace.fs.readFile).mockImplementation((uri) => {
			if (uri.fsPath === v1Path.fsPath) {
				return Promise.resolve(new TextEncoder().encode("V1 content"));
			}
			return Promise.reject(createNotFoundError());
		});

		const result = await readPromptFile(workspaceUri, v1File, legacyFile);

		expect(result).toEqual({
			content: "V1 content",
			isLegacy: false,
			filePath: v1Path.fsPath,
		});
		expect(window.showWarningMessage).not.toHaveBeenCalled();
	});

	it("falls back to legacy prompt and shows a warning", async () => {
		const legacyPath = Uri.joinPath(
			workspaceUri,
			".github",
			"prompts",
			legacyFile
		);

		vi.mocked(workspace.fs.readFile).mockImplementation((uri) => {
			if (uri.fsPath === legacyPath.fsPath) {
				return Promise.resolve(new TextEncoder().encode("Legacy content"));
			}
			return Promise.reject(createNotFoundError());
		});
		vi.mocked(window.showWarningMessage).mockResolvedValue(
			"Learn More" as unknown as import("vscode").MessageItem
		);

		const result = await readPromptFile(workspaceUri, v1File, legacyFile);

		expect(result).toEqual({
			content: "Legacy content",
			isLegacy: true,
			filePath: legacyPath.fsPath,
		});
		expect(window.showWarningMessage).toHaveBeenCalledWith(
			createDeprecationWarning(legacyFile, v1File),
			"Learn More"
		);
		expect(workspace.openTextDocument).toHaveBeenCalled();
		const [openArg] = vi.mocked(workspace.openTextDocument).mock.calls[0] ?? [];
		expect(openArg).toMatchObject({
			fsPath: Uri.joinPath(workspaceUri, "README.md").fsPath,
		});
		expect(window.showTextDocument).toHaveBeenCalled();
	});

	it("throws a migration error when neither prompt exists", async () => {
		vi.mocked(workspace.fs.readFile).mockRejectedValue(createNotFoundError());

		await expect(
			readPromptFile(workspaceUri, v1File, legacyFile)
		).rejects.toThrow(createMigrationError(v1File, workspaceUri.fsPath));
	});

	it("rethrows unexpected read errors", async () => {
		const unexpectedError = new Error("permission denied");
		vi.mocked(workspace.fs.readFile).mockRejectedValue(unexpectedError);

		await expect(
			readPromptFile(workspaceUri, v1File, legacyFile)
		).rejects.toThrow("permission denied");
	});

	it("creates migration and deprecation messages with filenames", () => {
		const migration = createMigrationError(v1File, "/work");
		expect(migration).toContain("OpenSpec v1 prompt files not found.");
		expect(migration).toContain(`Required: .github/prompts/${v1File}`);
		expect(migration).toContain("npm install -g openspec@latest");

		const deprecation = createDeprecationWarning(legacyFile, v1File);
		expect(deprecation).toContain(legacyFile);
		expect(deprecation).toContain(v1File);
	});
});
