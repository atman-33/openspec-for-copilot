import { Uri, window, workspace } from "vscode";

export interface PromptFileResult {
	content: string;
	isLegacy: boolean;
	filePath: string;
}

const PROMPTS_DIR = [".github", "prompts"] as const;
const README_FILENAME = "README.md";
const LEARN_MORE_ACTION = "Learn More";

const isFileNotFoundError = (error: unknown): boolean => {
	if (!error || typeof error !== "object") {
		return false;
	}

	const code = "code" in error ? String((error as { code?: string }).code) : "";
	const name = "name" in error ? String((error as { name?: string }).name) : "";

	return (
		code === "FileNotFound" ||
		code === "EntryNotFound" ||
		name === "FileNotFound" ||
		name === "EntryNotFound"
	);
};

export const readPromptFile = async (
	workspaceUri: Uri,
	v1Filename: string,
	legacyFilename: string
): Promise<PromptFileResult> => {
	const v1Path = Uri.joinPath(workspaceUri, ...PROMPTS_DIR, v1Filename);
	const legacyPath = Uri.joinPath(workspaceUri, ...PROMPTS_DIR, legacyFilename);

	try {
		const fileData = await workspace.fs.readFile(v1Path);
		const content = new TextDecoder().decode(fileData);
		return {
			content,
			isLegacy: false,
			filePath: v1Path.fsPath,
		};
	} catch (error) {
		if (!isFileNotFoundError(error)) {
			throw error;
		}
	}

	try {
		const fileData = await workspace.fs.readFile(legacyPath);
		const content = new TextDecoder().decode(fileData);

		const selection = await window.showWarningMessage(
			createDeprecationWarning(legacyFilename, v1Filename),
			LEARN_MORE_ACTION
		);
		if (selection === LEARN_MORE_ACTION) {
			const readmeUri = Uri.joinPath(workspaceUri, README_FILENAME);
			try {
				const doc = await workspace.openTextDocument(readmeUri);
				await window.showTextDocument(doc);
			} catch {
				// Ignore README open failures.
			}
		}

		return {
			content,
			isLegacy: true,
			filePath: legacyPath.fsPath,
		};
	} catch (error) {
		if (!isFileNotFoundError(error)) {
			throw error;
		}
	}

	throw new Error(createMigrationError(v1Filename, workspaceUri.fsPath));
};

export const createMigrationError = (
	v1Filename: string,
	workspacePath: string
): string =>
	`OpenSpec v1 prompt files not found.

Required: .github/prompts/${v1Filename}

To migrate to OpenSpec v1:
1. Install OpenSpec CLI v1:
   npm install -g openspec@latest

2. Initialize OpenSpec v1 in your workspace:
   cd ${workspacePath}
   openspec init

This will generate the required v1 prompt files in .github/prompts/

For more information, see README.md in your workspace.`;

export const createDeprecationWarning = (
	legacyFile: string,
	v1File: string
): string =>
	`⚠️ Using legacy OpenSpec v0.x prompt file: ${legacyFile}

Please migrate to OpenSpec v1 by running 'openspec init' in your workspace.
This will create the new prompt file: ${v1File}

Legacy support will be removed in a future release.`;
