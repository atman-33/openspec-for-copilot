import { commands, env, window, workspace } from "vscode";
import type { ExtensionContext, Uri } from "vscode";
import type { SpecExplorerProvider } from "../../providers/spec-explorer-provider";
import type { ExtensionServices } from "../extension-services";
import { createDetailedDesignCommandHandler } from "../../features/spec/commands/create-detailed-design";
import { createGitHubIssueCommandHandler } from "../../features/spec/commands/create-github-issue";
import { updateSpecsFromDetailedDesignCommandHandler } from "../../features/spec/commands/update-specs-from-detailed-design";
import { sendPromptToChat } from "../../utils/chat-prompt-runner";
import { readPromptFile } from "../../utils/openspec-prompt-utils";
interface SpecCommandItem {
	label?: string;
	specName?: string;
}

export const registerSpecCommands = (
	context: ExtensionContext,
	services: ExtensionServices,
	specExplorer: SpecExplorerProvider
) => {
	const { outputChannel, specManager } = services;

	const createSpecCommand = commands.registerCommand(
		"openspec-for-copilot.spec.create",
		async () => {
			outputChannel.appendLine(
				`[Spec] create command triggered at ${new Date().toISOString()}`
			);

			try {
				await specManager.create();
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				outputChannel.appendLine(`[Spec] create command failed: ${message}`);
				window.showErrorMessage(`Failed to create spec prompt: ${message}`);
			}
		}
	);

	context.subscriptions.push(
		commands.registerCommand("openspec-for-copilot.noop", () => {
			// noop
		}),
		createSpecCommand,
		commands.registerCommand(
			"openspec-for-copilot.spec.navigate.requirements",
			async (specName: string) => {
				await specManager.navigateToDocument(specName, "requirements");
			}
		),
		commands.registerCommand(
			"openspec-for-copilot.spec.navigate.design",
			async (specName: string) => {
				await specManager.navigateToDocument(specName, "design");
			}
		),
		commands.registerCommand(
			"openspec-for-copilot.spec.navigate.tasks",
			async (specName: string) => {
				await specManager.navigateToDocument(specName, "tasks");
			}
		),
		commands.registerCommand(
			"openspec-for-copilot.spec.implTask",
			async (documentUri: Uri) => {
				outputChannel.appendLine(
					`[Task Execute] Generating OpenSpec apply prompt for: ${documentUri.fsPath}`
				);
				await specManager.runOpenSpecApply(documentUri);
			}
		),
		commands.registerCommand(
			"openspec-for-copilot.spec.implTaskSingle",
			async (documentUri: Uri, taskLineNumber: number, taskText: string) => {
				outputChannel.appendLine(
					`[Task Execute Single] Executing task ${taskLineNumber}: ${taskText}`
				);
				try {
					await specManager.runOpenSpecApply(documentUri, {
						taskNumber: taskLineNumber,
						taskText,
					});
				} catch (error) {
					const message =
						error instanceof Error ? error.message : String(error);
					outputChannel.appendLine(`[Task Execute Single] Failed: ${message}`);
					window.showErrorMessage(`Failed to execute task: ${message}`);
				}
			}
		),
		commands.registerCommand(
			"openspec-for-copilot.spec.open",
			async (relativePath: string, type: string) => {
				await specManager.openDocument(relativePath, type);
			}
		),
		// biome-ignore lint/suspicious/useAwait: ignore
		commands.registerCommand("openspec-for-copilot.spec.refresh", async () => {
			outputChannel.appendLine("[Manual Refresh] Refreshing spec explorer...");
			specExplorer.refresh();
		}),
		commands.registerCommand(
			"openspec-for-copilot.spec.delete",
			async (item: SpecCommandItem) => {
				const label = item?.label;
				if (!label) {
					window.showErrorMessage("Could not determine item name.");
					return;
				}
				await specManager.delete(label);
			}
		),
		commands.registerCommand(
			"openspec-for-copilot.spec.copyName",
			async (item: SpecCommandItem) => {
				const name: string | undefined = item?.specName ?? item?.label;
				if (!name) {
					window.showErrorMessage("Could not determine item name.");
					return;
				}
				await env.clipboard.writeText(name);
				window.setStatusBarMessage(`Copied: ${name}`, 2000);
			}
		),
		commands.registerCommand(
			"openspec-for-copilot.spec.createDetailedDesign",
			createDetailedDesignCommandHandler(services, specExplorer)
		),
		commands.registerCommand(
			"openspec-for-copilot.spec.updateSpecsFromDetailedDesign",
			updateSpecsFromDetailedDesignCommandHandler(services, specExplorer)
		),
		commands.registerCommand(
			"openspec-for-copilot.spec.archiveChange",
			async (item: SpecCommandItem) => {
				const changeId: string | undefined = item?.specName;
				if (!changeId) {
					window.showErrorMessage("Could not determine change ID.");
					return;
				}

				const ws = workspace.workspaceFolders?.[0];
				if (!ws) {
					window.showErrorMessage("No workspace folder found");
					return;
				}

				try {
					const result = await readPromptFile(
						ws.uri,
						"opsx-archive.prompt.md",
						"openspec-archive.prompt.md"
					);
					if (result.isLegacy) {
						outputChannel.appendLine(
							`[Archive Change] Using legacy prompt file: ${result.filePath}`
						);
					}
					const fullPrompt = `${result.content}\n\nid: ${changeId}`;

					outputChannel.appendLine(
						`[Archive Change] Archiving change: ${changeId}`
					);
					await sendPromptToChat(fullPrompt, {
						instructionType: "archiveChange",
					});
				} catch (error) {
					const message =
						error instanceof Error ? error.message : String(error);
					window.showErrorMessage(`Failed to read archive prompt: ${message}`);
				}
			}
		),
		commands.registerCommand(
			"openspec-for-copilot.spec.createGitHubIssue",
			createGitHubIssueCommandHandler(services)
		)
	);
};
