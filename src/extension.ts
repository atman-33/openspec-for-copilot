import {
	type DocumentSelector,
	type ExtensionContext,
	languages,
	window,
	workspace,
} from "vscode";
import { registerCommands } from "./activation/register-commands";
import { setupFileWatchers } from "./activation/setup-file-watchers";
import { setupSaveGuards } from "./activation/setup-save-guards";
import type { ExtensionServices } from "./activation/extension-services";
import { SpecManager } from "./features/spec/spec-manager";
import { SteeringManager } from "./features/steering/steering-manager";
import { CopilotProvider } from "./providers/copilot-provider";
import { OverviewProvider } from "./providers/overview-provider";
import { PromptsExplorerProvider } from "./providers/prompts-explorer-provider";
import { SpecExplorerProvider } from "./providers/spec-explorer-provider";
import { SpecTaskCodeLensProvider } from "./providers/spec-task-code-lens-provider";
import { SteeringExplorerProvider } from "./providers/steering-explorer-provider";
import { PromptLoader } from "./services/prompt-loader";
import { ConfigManager } from "./utils/config-manager";

export async function activate(context: ExtensionContext) {
	// Create output channel for debugging
	const outputChannel = window.createOutputChannel(
		"OpenSpec for Copilot - Debug"
	);

	// Initialize PromptLoader
	try {
		const promptLoader = PromptLoader.getInstance();
		promptLoader.initialize();
		outputChannel.appendLine("PromptLoader initialized successfully");
	} catch (error) {
		outputChannel.appendLine(`Failed to initialize PromptLoader: ${error}`);
		window.showErrorMessage(`Failed to initialize prompt system: ${error}`);
	}

	// Check workspace status
	const workspaceFolders = workspace.workspaceFolders;
	if (!workspaceFolders || workspaceFolders.length === 0) {
		outputChannel.appendLine("WARNING: No workspace folder found!");
	}

	// Initialize Copilot provider
	const copilotProvider = new CopilotProvider(context, outputChannel);

	const configManager = ConfigManager.getInstance();
	await configManager.loadSettings();

	// Initialize feature managers with output channel
	const specManager = new SpecManager(context, outputChannel);
	const steeringManager = new SteeringManager(
		context,
		copilotProvider,
		outputChannel
	);

	const services: ExtensionServices = {
		outputChannel,
		configManager,
		specManager,
		steeringManager,
		copilotProvider,
	};

	// Register tree data providers
	const overviewProvider = new OverviewProvider(context);
	const specExplorer = new SpecExplorerProvider(context);
	const steeringExplorer = new SteeringExplorerProvider(context);
	const promptsExplorer = new PromptsExplorerProvider(context);

	// Set managers
	specExplorer.setSpecManager(specManager);
	steeringExplorer.setSteeringManager(steeringManager);

	context.subscriptions.push(
		window.registerTreeDataProvider(
			"openspec-for-copilot.views.overview",
			overviewProvider
		),
		window.registerTreeDataProvider(
			"openspec-for-copilot.views.specExplorer",
			specExplorer
		),
		window.registerTreeDataProvider(
			"openspec-for-copilot.views.steeringExplorer",
			steeringExplorer
		)
	);
	context.subscriptions.push(
		window.registerTreeDataProvider(
			"openspec-for-copilot.views.promptsExplorer",
			promptsExplorer
		)
	);

	// Register commands
	registerCommands(context, services, {
		specExplorer,
		steeringExplorer,
		promptsExplorer,
	});

	// Save guards
	setupSaveGuards(context);

	// Set up file watchers
	setupFileWatchers(context, services, {
		specExplorer,
		steeringExplorer,
		promptsExplorer,
	});

	// Register CodeLens provider for spec tasks
	const specTaskCodeLensProvider = new SpecTaskCodeLensProvider();

	// Use document selector for spec task files (dynamic paths handled inside provider)
	const selector: DocumentSelector = [
		{
			language: "markdown",
			pattern: "**/*tasks.md",
			scheme: "file",
		},
	];

	const disposable = languages.registerCodeLensProvider(
		selector,
		specTaskCodeLensProvider
	);

	context.subscriptions.push(disposable);

	outputChannel.appendLine("CodeLens provider for spec tasks registered");
}

// biome-ignore lint/suspicious/noEmptyBlockStatements: ignore
export function deactivate() {}
