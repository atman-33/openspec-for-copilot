import type { WorkspaceFolder } from "vscode";
import { Uri, window, workspace } from "vscode";
import type { SpecExplorerProvider } from "../../../providers/spec-explorer-provider";
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

const ensureUpdateSpecsPromptTemplate = async (
	wsUri: Uri,
	extensionUri: Uri
) => {
	const promptsDir = Uri.joinPath(wsUri, ".github", "prompts");
	const promptPath = Uri.joinPath(
		promptsDir,
		"openspec-update-specs-from-detailed-design.prompt.md"
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
			"openspec-update-specs-from-detailed-design.prompt.md"
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
	const detailedDesignPath = Uri.joinPath(changeBase, "detailed-design.md");
	const proposalPath = Uri.joinPath(changeBase, "proposal.md");
	const tasksPath = Uri.joinPath(changeBase, "tasks.md");
	const designPath = Uri.joinPath(changeBase, "design.md");

	let hasDesign = false;
	try {
		await workspace.fs.stat(designPath);
		hasDesign = true;
	} catch {
		hasDesign = false;
	}

	return {
		detailedDesignPath: getRelativePath(detailedDesignPath),
		proposalPath: getRelativePath(proposalPath),
		tasksPath: getRelativePath(tasksPath),
		designPath: hasDesign ? getRelativePath(designPath) : null,
	};
};

const getDeltaSpecPaths = async (
	changeBase: Uri,
	specManager: ExtensionServices["specManager"],
	changeId: string
) => {
	const deltaSpecNames = await specManager.getChangeSpecs(changeId);
	const deltaSpecs: Array<{ name: string; path: string }> = [];
	for (const specName of deltaSpecNames) {
		const specUri = Uri.joinPath(changeBase, "specs", specName, "spec.md");
		deltaSpecs.push({ name: specName, path: getRelativePath(specUri) });
	}
	return deltaSpecs;
};

const composeUpdateSpecsPrompt = (args: {
	promptTemplate: string;
	changeId: string;
	detailedDesignPath: string;
	proposalPath: string;
	tasksPath: string;
	designPath: string | null;
	deltaSpecs: Array<{ name: string; path: string }>;
}) => {
	const sections: string[] = [];
	sections.push(args.promptTemplate.trim());
	sections.push(`\n\n---\n\n# Inputs\n\nchange-id: ${args.changeId}`);

	sections.push("\n\nPlease refer to the following files for context:");
	sections.push(
		`\n- **detailed-design.md** (Source of Truth): [${args.detailedDesignPath}](${args.detailedDesignPath})`
	);
	sections.push(
		`- **proposal.md** (Target): [${args.proposalPath}](${args.proposalPath})`
	);
	sections.push(
		`- **tasks.md** (Target): [${args.tasksPath}](${args.tasksPath})`
	);

	if (args.designPath) {
		sections.push(
			`- **design.md** (Target): [${args.designPath}](${args.designPath})`
		);
	}

	if (args.deltaSpecs.length > 0) {
		sections.push("- **delta specs** (Target):");
		for (const s of args.deltaSpecs) {
			sections.push(`  - [${s.path}](${s.path})`);
		}
	}

	sections.push(
		"\n\n---\n\nNow generate the updated content for the target files based on the detailed design.\n" +
			"Return the updates in code blocks with file paths."
	);

	return sections.join("\n");
};

export const updateSpecsFromDetailedDesignCommandHandler =
	(services: ExtensionServices, specExplorer: SpecExplorerProvider) =>
	async (item: unknown) => {
		try {
			const changeId = getChangeIdOrThrow(item);
			const ws = getWorkspaceFolderOrThrow();
			const changeBase = Uri.joinPath(ws.uri, "openspec", "changes", changeId);

			const promptPath = await ensureUpdateSpecsPromptTemplate(
				ws.uri,
				services.extensionUri
			);
			const promptTemplate = await readUtf8OrThrow(
				promptPath,
				"prompt template"
			);

			const docs = await getChangeDocumentPaths(changeBase);
			const deltaSpecs = await getDeltaSpecPaths(
				changeBase,
				services.specManager,
				changeId
			);

			const prompt = composeUpdateSpecsPrompt({
				promptTemplate,
				changeId,
				detailedDesignPath: docs.detailedDesignPath,
				proposalPath: docs.proposalPath,
				tasksPath: docs.tasksPath,
				designPath: docs.designPath,
				deltaSpecs,
			});

			await sendPromptToChat(prompt);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			window.showErrorMessage(
				`Failed to update specs from detailed design: ${message}`
			);
		}
	};
