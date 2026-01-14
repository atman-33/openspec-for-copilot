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

		const text = document.getText();
		const codeLenses: CodeLens[] = [];

		// Parse individual incomplete tasks
		const taskPattern = /^(\s*)-\s*\[\s*\]\s*(.+)$/gm;
		let match: RegExpExecArray | null;
		const incompleteTasks: Array<{ lineNumber: number; taskText: string }> = [];

		while ((match = taskPattern.exec(text)) !== null) {
			const lineNumber = document.positionAt(match.index).line;
			const taskText = match[2].trim();
			incompleteTasks.push({ lineNumber, taskText });

			// Create CodeLens above each incomplete task
			const range = new Range(lineNumber, 0, lineNumber, 0);
			codeLenses.push(
				new CodeLens(range, {
					title: "$(play) Execute This Task",
					tooltip: "Execute only this task",
					command: "openspec-for-copilot.spec.implTaskSingle",
					arguments: [document.uri, lineNumber + 1, taskText],
				})
			);
		}

		// Create batch execution CodeLens at the top of the file
		const topRange = new Range(0, 0, 0, 0);
		const hasCompletedTasks = text.includes("- [x]");

		if (incompleteTasks.length > 0) {
			codeLenses.unshift(
				new CodeLens(topRange, {
					title: "$(play) Start All Tasks",
					tooltip: "Click to generate OpenSpec apply prompt",
					command: "openspec-for-copilot.spec.implTask",
					arguments: [document.uri],
				})
			);
		} else if (hasCompletedTasks) {
			codeLenses.unshift(
				new CodeLens(topRange, {
					title: "$(check) All Tasks Completed",
					tooltip: "All tasks are completed",
					command: "openspec-for-copilot.noop",
				})
			);
		}

		return codeLenses;
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
