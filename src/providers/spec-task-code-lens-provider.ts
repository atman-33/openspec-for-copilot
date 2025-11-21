import {
	type CancellationToken,
	CodeLens,
	type CodeLensProvider,
	type Event,
	EventEmitter,
	Range,
	type TextDocument,
	workspace,
} from "vscode";

import { join, relative } from "path";
import { VSC_CONFIG_NAMESPACE } from "../constants";
import { ConfigManager } from "../utils/config-manager";

export class SpecTaskCodeLensProvider implements CodeLensProvider {
	private readonly _onDidChangeCodeLenses: EventEmitter<void> =
		new EventEmitter<void>();
	readonly onDidChangeCodeLenses: Event<void> =
		this._onDidChangeCodeLenses.event;
	private readonly configManager: ConfigManager;

	constructor() {
		this.configManager = ConfigManager.getInstance();
		workspace.onDidChangeConfiguration((event) => {
			if (event.affectsConfiguration(VSC_CONFIG_NAMESPACE)) {
				// biome-ignore lint/complexity/noVoid: ignore
				void this.configManager.loadSettings();
			}
			this._onDidChangeCodeLenses.fire();
		});
	}

	provideCodeLenses(
		document: TextDocument,
		token: CancellationToken
	): CodeLens[] | Thenable<CodeLens[]> {
		if (!this.isSpecTaskDocument(document)) {
			return [];
		}

		// Create a single CodeLens at the top of the file
		const range = new Range(0, 0, 0, 0);
		const text = document.getText();
		const hasIncompleteTasks = text.includes("- [ ]");
		const hasCompletedTasks = text.includes("- [x]");

		if (hasIncompleteTasks) {
			return [
				new CodeLens(range, {
					title: "$(play) Start All Tasks",
					tooltip: "Click to generate OpenSpec apply prompt",
					command: "kiro-codex-ide.spec.implTask",
					arguments: [document.uri],
				}),
			];
		}

		if (hasCompletedTasks) {
			return [
				new CodeLens(range, {
					title: "$(check) All Tasks Completed",
					tooltip: "All tasks are completed",
					command: "kiro-codex-ide.noop",
				}),
			];
		}

		return [];
	}

	private isSpecTaskDocument(document: TextDocument): boolean {
		if (!document.fileName.endsWith("tasks.md")) {
			return false;
		}

		// Check if inside configured specs path
		try {
			const specBasePath = this.configManager.getAbsolutePath("specs");
			const relativePath = relative(specBasePath, document.uri.fsPath);
			if (relativePath && !relativePath.startsWith("..")) {
				return true;
			}
		} catch (error) {
			// ignore
		}

		// Check if inside "openspec" folder in workspace (standard OpenSpec structure)
		const workspaceFolder = workspace.getWorkspaceFolder(document.uri);
		if (workspaceFolder) {
			const openspecPath = join(workspaceFolder.uri.fsPath, "openspec");
			const relativePath = relative(openspecPath, document.uri.fsPath);
			if (relativePath && !relativePath.startsWith("..")) {
				return true;
			}
		}

		return false;
	}

	resolveCodeLens(codeLens: CodeLens, token: CancellationToken) {
		return codeLens;
	}
}
