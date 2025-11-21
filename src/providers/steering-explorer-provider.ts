import { existsSync } from "fs";
import { join, relative } from "path";
import {
	type Command,
	type Event,
	type ExtensionContext,
	type TreeDataProvider,
	EventEmitter,
	ThemeIcon,
	TreeItem,
	TreeItemCollapsibleState,
	Uri,
	workspace,
	FileType,
} from "vscode";
import type { SteeringManager } from "../features/steering/steering-manager";

import { homedir } from "os";
import { getVSCodeUserDataPath, isWindowsOrWsl } from "../utils/platform-utils";

const { joinPath } = Uri;

export class SteeringExplorerProvider
	implements TreeDataProvider<SteeringItem>
{
	static readonly viewId = "openspec-for-copilot.views.steeringExplorer";
	static readonly createUserRuleCommandId =
		"openspec-for-copilot.steering.createUserRule";
	static readonly createProjectRuleCommandId =
		"openspec-for-copilot.steering.createProjectRule";
	private readonly _onDidChangeTreeData: EventEmitter<
		SteeringItem | undefined | null | void
	> = new EventEmitter<SteeringItem | undefined | null | void>();
	readonly onDidChangeTreeData: Event<SteeringItem | undefined | null | void> =
		this._onDidChangeTreeData.event;

	private steeringManager!: SteeringManager;
	private readonly context: ExtensionContext;

	constructor(context: ExtensionContext) {
		this.context = context;
	}

	setSteeringManager(steeringManager: SteeringManager) {
		this.steeringManager = steeringManager;
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	private readonly getGlobalPromptsRoot = async (): Promise<
		Uri | undefined
	> => {
		try {
			if (isWindowsOrWsl()) {
				const userDataPath = await getVSCodeUserDataPath();
				return joinPath(Uri.file(userDataPath), "prompts");
			}

			const homeUri = Uri.file(homedir());
			return joinPath(homeUri, ".github", "prompts");
		} catch {
			return;
		}
	};

	private readonly getGlobalPromptsLabel = async (): Promise<string> => {
		if (isWindowsOrWsl()) {
			const userDataPath = await getVSCodeUserDataPath();
			return join(userDataPath, "prompts");
		}

		const home = homedir();
		if (!home) {
			return ".github/prompts";
		}

		return `${home}/.github/prompts`;
	};

	private readonly readMarkdownFiles = async (
		dir: Uri,
		suffix: string
	): Promise<string[]> => {
		const results: string[] = [];
		try {
			const entries = await workspace.fs.readDirectory(dir);
			for (const [name, type] of entries) {
				const entryUri = joinPath(dir, name);
				if (type === FileType.File && name.endsWith(suffix)) {
					results.push(entryUri.fsPath);
					continue;
				}

				if (type === FileType.Directory) {
					const nested = await this.readMarkdownFiles(entryUri, suffix);
					results.push(...nested);
				}
			}
		} catch {
			// Directory may not exist yet
		}
		return results;
	};

	getTreeItem(element: SteeringItem): TreeItem {
		return element;
	}

	// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ignore
	async getChildren(element?: SteeringItem): Promise<SteeringItem[]> {
		if (!element) {
			const items: SteeringItem[] = [];

			if (workspace.workspaceFolders) {
				const workspaceRoot = workspace.workspaceFolders[0].uri.fsPath;

				// Check if any project instruction files exist
				const projectCopilotMd = join(
					workspaceRoot,
					".github",
					"copilot-instructions.md"
				);
				const agentsMd = join(workspaceRoot, "openspec", "AGENTS.md");
				const rootAgentsMd = join(workspaceRoot, "AGENTS.md");

				const hasProjectInstructions =
					existsSync(projectCopilotMd) ||
					existsSync(agentsMd) ||
					existsSync(rootAgentsMd);

				if (hasProjectInstructions) {
					items.push(
						new SteeringItem(
							"AGENTS",
							TreeItemCollapsibleState.Expanded,
							"project-instructions-group",
							"",
							this.context
						)
					);
				} else {
					items.push(
						new SteeringItem(
							"Create Project Instructions",
							TreeItemCollapsibleState.None,
							"create-project-instructions",
							"",
							this.context,
							{
								command: SteeringExplorerProvider.createProjectRuleCommandId,
								title: "Create Project Instructions",
							}
						)
					);
				}

				// Project Spec Group
				const projectSpecMd = join(workspaceRoot, "openspec", "project.md");
				if (existsSync(projectSpecMd)) {
					items.push(
						new SteeringItem(
							"Project Spec",
							TreeItemCollapsibleState.Expanded,
							"project-spec-group",
							"",
							this.context
						)
					);
				}
			}

			// Traditional steering documents - add them directly at root level if they exist
			if (workspace.workspaceFolders && this.steeringManager) {
				const steeringDocs = await this.steeringManager.getSteeringDocuments();
				if (steeringDocs.length > 0) {
					// Add a collapsible header item for steering documents
					items.push(
						new SteeringItem(
							"Steering Docs",
							TreeItemCollapsibleState.Expanded, // Make it expandable
							"steering-header",
							"",
							this.context
						)
					);
				}
			}

			return items;
		}

		if (element.contextValue === "project-instructions-group") {
			const items: SteeringItem[] = [];
			if (workspace.workspaceFolders) {
				const workspaceRoot = workspace.workspaceFolders[0].uri.fsPath;

				const projectCopilotMd = join(
					workspaceRoot,
					".github",
					"copilot-instructions.md"
				);
				if (existsSync(projectCopilotMd)) {
					items.push(
						new SteeringItem(
							"Copilot Instructions",
							TreeItemCollapsibleState.None,
							"project-copilot-instructions",
							projectCopilotMd,
							this.context,
							{
								command: "vscode.open",
								title: "Open Copilot Instructions",
								arguments: [Uri.file(projectCopilotMd)],
							}
						)
					);
				}

				const agentsMd = join(workspaceRoot, "openspec", "AGENTS.md");
				if (existsSync(agentsMd)) {
					items.push(
						new SteeringItem(
							"Agent Instructions",
							TreeItemCollapsibleState.None,
							"project-agents-md",
							agentsMd,
							this.context,
							{
								command: "vscode.open",
								title: "Open Agent Instructions",
								arguments: [Uri.file(agentsMd)],
							}
						)
					);
				}

				const rootAgentsMd = join(workspaceRoot, "AGENTS.md");
				if (existsSync(rootAgentsMd)) {
					items.push(
						new SteeringItem(
							"Root Instructions",
							TreeItemCollapsibleState.None,
							"root-agents-md",
							rootAgentsMd,
							this.context,
							{
								command: "vscode.open",
								title: "Open Root Instructions",
								arguments: [Uri.file(rootAgentsMd)],
							}
						)
					);
				}
			}
			return items;
		}

		if (element.contextValue === "project-spec-group") {
			const items: SteeringItem[] = [];
			if (workspace.workspaceFolders) {
				const workspaceRoot = workspace.workspaceFolders[0].uri.fsPath;
				const projectSpecMd = join(workspaceRoot, "openspec", "project.md");
				if (existsSync(projectSpecMd)) {
					items.push(
						new SteeringItem(
							"Project Definition",
							TreeItemCollapsibleState.None,
							"project-spec-md",
							projectSpecMd,
							this.context,
							{
								command: "vscode.open",
								title: "Open Project Definition",
								arguments: [Uri.file(projectSpecMd)],
							}
						)
					);
				}
			}
			return items;
		}

		if (element.contextValue === "steering-header") {
			// Return steering documents as children of the header
			const items: SteeringItem[] = [];

			if (workspace.workspaceFolders && this.steeringManager) {
				const steeringDocs = await this.steeringManager.getSteeringDocuments();
				const workspacePath = workspace.workspaceFolders[0].uri.fsPath;

				for (const doc of steeringDocs) {
					// Calculate relative path from workspace root
					const relativePath = relative(workspacePath, doc.path);
					items.push(
						new SteeringItem(
							doc.name,
							TreeItemCollapsibleState.None,
							"steering-document",
							doc.path,
							this.context,
							{
								command: "vscode.open",
								title: "Open Steering Document",
								arguments: [Uri.file(doc.path)],
							},
							relativePath // Pass relative path without prefix
						)
					);
				}
			}

			return items;
		}

		return [];
	}
}

class SteeringItem extends TreeItem {
	readonly label: string;
	readonly collapsibleState: TreeItemCollapsibleState;
	readonly contextValue: string;
	readonly resourcePath: string;
	private readonly context: ExtensionContext;
	readonly command?: Command;
	private readonly filename?: string;
	// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ignore
	// biome-ignore lint/nursery/useMaxParams: ignore
	constructor(
		label: string,
		collapsibleState: TreeItemCollapsibleState,
		contextValue: string,
		resourcePath: string,
		context: ExtensionContext,
		command?: Command,
		filename?: string,
		description?: string
	) {
		super(label, collapsibleState);
		this.label = label;
		this.collapsibleState = collapsibleState;
		this.contextValue = contextValue;
		this.resourcePath = resourcePath;
		this.context = context;
		this.command = command;
		this.filename = filename;

		// Set appropriate icons based on type
		if (contextValue === "project-instructions-group") {
			this.iconPath = new ThemeIcon("folder");
			this.tooltip = "AGENTS";
		} else if (contextValue === "create-project-instructions") {
			this.iconPath = new ThemeIcon("folder-active");
			this.tooltip = "Click to create Project Instructions";
		} else if (contextValue === "project-copilot-instructions") {
			this.iconPath = new ThemeIcon("github");
			this.tooltip = `Copilot Instructions: ${resourcePath}`;
			this.description = ".github/copilot-instructions.md";
		} else if (contextValue === "project-agents-md") {
			this.iconPath = new ThemeIcon("robot");
			this.tooltip = `Agent Instructions: ${resourcePath}`;
			this.description = "openspec/AGENTS.md";
		} else if (contextValue === "root-agents-md") {
			this.iconPath = new ThemeIcon("file-text");
			this.tooltip = `Root Instructions: ${resourcePath}`;
			this.description = "AGENTS.md";
		} else if (contextValue === "project-spec-group") {
			this.iconPath = new ThemeIcon("book");
			this.tooltip = "Project Specification";
		} else if (contextValue === "project-spec-md") {
			this.iconPath = new ThemeIcon("file-code");
			this.tooltip = `Project Definition: ${resourcePath}`;
			this.description = "openspec/project.md";
		} else if (contextValue === "separator") {
			this.iconPath = undefined;
			this.description = undefined;
		} else if (contextValue === "steering-header") {
			this.iconPath = new ThemeIcon("folder-library");
			this.description = undefined;
			// Make it visually distinct but not clickable
			this.tooltip = "Generated project steering documents";
		} else if (contextValue === "steering-document") {
			// Different icons for different steering documents
			if (label === "product") {
				this.iconPath = new ThemeIcon("lightbulb-empty");
			} else if (label === "tech") {
				this.iconPath = new ThemeIcon("circuit-board");
			} else if (label === "structure") {
				this.iconPath = new ThemeIcon("list-tree");
			} else {
				this.iconPath = new ThemeIcon("file");
			}
			this.tooltip = `Steering document: ${resourcePath}`;
			this.description = filename; // Show the relative path
		}
	}
}
