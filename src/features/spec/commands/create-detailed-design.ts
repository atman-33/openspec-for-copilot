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

const ensureDetailedDesignPromptTemplate = async (
	wsUri: Uri,
	extensionUri: Uri
) => {
	const promptsDir = Uri.joinPath(wsUri, ".github", "prompts");
	const promptPath = Uri.joinPath(
		promptsDir,
		"openspec-create-detailed-design.prompt.md"
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
			"openspec-create-detailed-design.prompt.md"
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

const readChangeDocumentsOrThrow = async (changeBase: Uri) => {
	const proposalPath = Uri.joinPath(changeBase, "proposal.md");
	const tasksPath = Uri.joinPath(changeBase, "tasks.md");
	const designPath = Uri.joinPath(changeBase, "design.md");

	const proposal = await readUtf8OrThrow(proposalPath, "proposal.md");
	const tasks = await readUtf8OrThrow(tasksPath, "tasks.md");

	let design: string | null = null;
	try {
		design = await readUtf8OrThrow(designPath, "design.md");
	} catch {
		design = null;
	}

	return { proposal, tasks, design };
};

const readDeltaSpecsOrThrow = async (
	changeBase: Uri,
	specManager: ExtensionServices["specManager"],
	changeId: string
) => {
	const deltaSpecNames = await specManager.getChangeSpecs(changeId);
	const deltaSpecs: Array<{ name: string; content: string }> = [];
	for (const specName of deltaSpecNames) {
		const specUri = Uri.joinPath(changeBase, "specs", specName, "spec.md");
		const content = await readUtf8OrThrow(specUri, `delta spec ${specName}`);
		deltaSpecs.push({ name: specName, content });
	}
	return deltaSpecs;
};

const composeDetailedDesignPrompt = (args: {
	promptTemplate: string;
	changeId: string;
	proposal: string;
	tasks: string;
	design: string | null;
	deltaSpecs: Array<{ name: string; content: string }>;
}) => {
	const sections: string[] = [];
	sections.push(args.promptTemplate.trim());
	sections.push(`\n\n---\n\n# Inputs\n\nchange-id: ${args.changeId}`);
	sections.push(
		`\n\n## proposal.md\n\n\`\`\`markdown\n${args.proposal}\n\`\`\``
	);
	sections.push(`\n\n## tasks.md\n\n\`\`\`markdown\n${args.tasks}\n\`\`\``);
	if (args.design) {
		sections.push(`\n\n## design.md\n\n\`\`\`markdown\n${args.design}\n\`\`\``);
	}

	if (args.deltaSpecs.length > 0) {
		sections.push("\n\n## delta specs\n");
		for (const s of args.deltaSpecs) {
			sections.push(
				`\n\n### ${s.name}/spec.md\n\n\`\`\`markdown\n${s.content}\n\`\`\``
			);
		}
	}

	sections.push(
		"\n\n---\n\nNow generate the detailed design document. Return ONLY Markdown for detailed-design.md.\n\n" +
			"After generating the Markdown, I will paste it into: openspec/changes/" +
			args.changeId +
			"/detailed-design.md"
	);

	return sections.join("\n");
};

const ensureDetailedDesignFileExists = async (outputPath: Uri) => {
	try {
		await workspace.fs.stat(outputPath);
	} catch {
		const scaffold = Buffer.from(
			"# Detailed Design\n\n" +
				'> Run "Create Detailed Design" to send context to Copilot Chat, then paste the result here.\n'
		);
		await workspace.fs.writeFile(outputPath, scaffold);
	}
};

const openDocumentBestEffort = async (uri: Uri) => {
	try {
		const doc = await workspace.openTextDocument(uri);
		await window.showTextDocument(doc);
	} catch {
		// ignore UI open failures
	}
};

export const createDetailedDesignCommandHandler = (
	services: ExtensionServices,
	specExplorer: SpecExplorerProvider
) => {
	const { outputChannel, specManager } = services;

	return async (item: any) => {
		try {
			const changeId = getChangeIdOrThrow(item);
			const ws = getWorkspaceFolderOrThrow();
			const changeBase = Uri.joinPath(ws.uri, "openspec", "changes", changeId);
			const outputPath = Uri.joinPath(changeBase, "detailed-design.md");

			const promptPath = await ensureDetailedDesignPromptTemplate(
				ws.uri,
				services.extensionUri
			);
			const promptTemplate = await readUtf8OrThrow(promptPath, "prompt file");

			const { proposal, tasks, design } =
				await readChangeDocumentsOrThrow(changeBase);
			const deltaSpecs = await readDeltaSpecsOrThrow(
				changeBase,
				specManager,
				changeId
			);

			const composedPrompt = composeDetailedDesignPrompt({
				promptTemplate,
				changeId,
				proposal,
				tasks,
				design,
				deltaSpecs,
			});

			await ensureDetailedDesignFileExists(outputPath);
			await openDocumentBestEffort(outputPath);

			outputChannel.appendLine(
				`[Detailed Design] Sending prompt to Copilot Chat for: ${changeId}`
			);
			await sendPromptToChat(composedPrompt, {
				instructionType: "runPrompt",
			});

			specExplorer.refresh();
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			window.showErrorMessage(message);
		}
	};
};
