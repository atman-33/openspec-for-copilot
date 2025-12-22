import type { WorkspaceFolder } from "vscode";
import { Uri, window, workspace } from "vscode";
import { sendPromptToChat } from "../../../utils/chat-prompt-runner";
import type { ExtensionServices } from "../../../activation/extension-services";

const readUtf8OrThrow = async (uri: Uri, label: string) => {
	try {
		const data = await workspace.fs.readFile(uri);
		return new TextDecoder().decode(data);
	} catch (error) {
		throw new Error(
			`Missing or unreadable ${label}: ${uri.fsPath} (${error instanceof Error ? error.message : String(error)})`
		);
	}
};

const getChangeIdOrThrow = (item: unknown) => {
	const changeId = (item as { specName?: unknown } | null)?.specName;
	if (typeof changeId !== "string" || changeId.length === 0) {
		throw new Error("Could not determine change ID.");
	}
	return changeId;
};

const getWorkspaceFolderOrThrow = (): WorkspaceFolder => {
	const ws = workspace.workspaceFolders?.[0];
	if (!ws) {
		throw new Error("No workspace folder found");
	}
	return ws;
};

const ensureCreateGitHubIssuePromptTemplate = async (
	wsUri: Uri,
	extensionUri: Uri
) => {
	const promptsDir = Uri.joinPath(wsUri, ".github", "prompts");
	const promptPath = Uri.joinPath(
		promptsDir,
		"openspec-create-github-issue.prompt.md"
	);

	try {
		await workspace.fs.stat(promptPath);
		return promptPath;
	} catch {
		await workspace.fs.createDirectory(promptsDir);
		const templateUri = Uri.joinPath(
			extensionUri,
			"src",
			"resources",
			"prompts",
			"openspec-create-github-issue.prompt.md"
		);

		let templateBytes: Uint8Array;
		try {
			templateBytes = await workspace.fs.readFile(templateUri);
		} catch (error) {
			throw new Error(
				"Missing packaged prompt template: " +
					templateUri.fsPath +
					" (" +
					(error instanceof Error ? error.message : String(error)) +
					")"
			);
		}

		await workspace.fs.writeFile(promptPath, templateBytes);
		return promptPath;
	}
};

const getRelativePath = (uri: Uri) => workspace.asRelativePath(uri, false);

const getChangeDocumentPaths = async (changeBase: Uri) => {
	const proposalPath = Uri.joinPath(changeBase, "proposal.md");
	const tasksPath = Uri.joinPath(changeBase, "tasks.md");
	const designPath = Uri.joinPath(changeBase, "design.md");
	const detailedDesignPath = Uri.joinPath(changeBase, "detailed-design.md");

	let hasDesign = false;
	try {
		await workspace.fs.stat(designPath);
		hasDesign = true;
	} catch {
		hasDesign = false;
	}

	let hasDetailedDesign = false;
	try {
		await workspace.fs.stat(detailedDesignPath);
		hasDetailedDesign = true;
	} catch {
		hasDetailedDesign = false;
	}

	return {
		proposalPath: getRelativePath(proposalPath),
		tasksPath: getRelativePath(tasksPath),
		designPath: hasDesign ? getRelativePath(designPath) : null,
		detailedDesignPath: hasDetailedDesign
			? getRelativePath(detailedDesignPath)
			: null,
	};
};

const composeCreateGitHubIssuePrompt = (args: {
	promptTemplate: string;
	changeId: string;
	proposalPath: string;
	tasksPath: string;
	designPath: string | null;
	detailedDesignPath: string | null;
}) => {
	const sections: string[] = [];
	sections.push(args.promptTemplate.trim());
	sections.push(`\n\n---\n\n# Inputs\n\nchange-id: ${args.changeId}`);

	sections.push("\n\nPlease refer to the following files for context:");
	sections.push(
		`\n- **proposal.md**: [${args.proposalPath}](${args.proposalPath})`
	);
	sections.push(`- **tasks.md**: [${args.tasksPath}](${args.tasksPath})`);

	if (args.designPath) {
		sections.push(`- **design.md**: [${args.designPath}](${args.designPath})`);
	}

	if (args.detailedDesignPath) {
		sections.push(
			`- **detailed-design.md**: [${args.detailedDesignPath}](${args.detailedDesignPath})`
		);
	}

	return sections.join("\n");
};

export const createGitHubIssueCommandHandler = (
	services: ExtensionServices
) => {
	const { outputChannel } = services;

	return async (item: any) => {
		try {
			const changeId = getChangeIdOrThrow(item);
			const ws = getWorkspaceFolderOrThrow();
			const changeBase = Uri.joinPath(ws.uri, "openspec", "changes", changeId);

			const promptPath = await ensureCreateGitHubIssuePromptTemplate(
				ws.uri,
				services.extensionUri
			);
			const promptTemplate = await readUtf8OrThrow(promptPath, "prompt file");

			const { proposalPath, tasksPath, designPath, detailedDesignPath } =
				await getChangeDocumentPaths(changeBase);

			const composedPrompt = composeCreateGitHubIssuePrompt({
				promptTemplate,
				changeId,
				proposalPath,
				tasksPath,
				designPath,
				detailedDesignPath,
			});

			outputChannel.appendLine(
				`[Create GitHub Issue] Sending prompt to Copilot Chat for: ${changeId}`
			);
			await sendPromptToChat(composedPrompt, {
				instructionType: "runPrompt",
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			window.showErrorMessage(message);
		}
	};
};
