import { homedir } from "os";
import type { ExtensionContext, FileSystemWatcher } from "vscode";
import { RelativePattern, workspace } from "vscode";
import type { PromptsExplorerProvider } from "../providers/prompts-explorer-provider";
import type { SpecExplorerProvider } from "../providers/spec-explorer-provider";
import type { SteeringExplorerProvider } from "../providers/steering-explorer-provider";
import type { ExtensionServices } from "./extension-services";

export const setupFileWatchers = (
	context: ExtensionContext,
	services: ExtensionServices,
	explorers: {
		specExplorer: SpecExplorerProvider;
		steeringExplorer: SteeringExplorerProvider;
		promptsExplorer: PromptsExplorerProvider;
	}
) => {
	const { outputChannel, configManager } = services;
	const { specExplorer, steeringExplorer, promptsExplorer } = explorers;

	const copilotWatcher = workspace.createFileSystemWatcher("**/.copilot/**/*");

	let refreshTimeout: NodeJS.Timeout | undefined;
	const debouncedRefresh = (event: string, uri: import("vscode").Uri) => {
		outputChannel.appendLine(`[FileWatcher] ${event}: ${uri.fsPath}`);

		if (refreshTimeout) {
			clearTimeout(refreshTimeout);
		}

		refreshTimeout = setTimeout(() => {
			specExplorer.refresh();
			steeringExplorer.refresh();
			promptsExplorer.refresh();
		}, 1000);
	};

	const attachWatcherHandlers = (watcher: FileSystemWatcher) => {
		watcher.onDidCreate((uri) => debouncedRefresh("Create", uri));
		watcher.onDidDelete((uri) => debouncedRefresh("Delete", uri));
		watcher.onDidChange((uri) => debouncedRefresh("Change", uri));
	};

	attachWatcherHandlers(copilotWatcher);

	const watchers: FileSystemWatcher[] = [copilotWatcher];

	const wsFolder = workspace.workspaceFolders?.[0];
	if (wsFolder) {
		const normalizeRelativePath = (value: string) =>
			value
				.replace(/\\/g, "/")
				// biome-ignore lint/performance/useTopLevelRegex: ignore
				.replace(/^\.\//, "")
				// biome-ignore lint/performance/useTopLevelRegex: ignore
				.replace(/\/+$/, "");

		const configuredPaths = [
			configManager.getPath("prompts"),
			configManager.getPath("specs"),
		];

		const extraPatterns = new Set<string>();
		for (const rawPath of configuredPaths) {
			const normalized = normalizeRelativePath(rawPath);
			if (!normalized || normalized.startsWith("..")) {
				continue;
			}
			if (normalized === ".copilot" || normalized.startsWith(".copilot/")) {
				continue;
			}
			extraPatterns.add(`${normalized}/**/*`);
		}

		for (const pattern of extraPatterns) {
			const watcher = workspace.createFileSystemWatcher(
				new RelativePattern(wsFolder, pattern)
			);
			attachWatcherHandlers(watcher);
			watchers.push(watcher);
		}
	}

	context.subscriptions.push(...watchers);

	const globalHome = homedir() || process.env.USERPROFILE || "";
	const globalCopilotMdWatcher = workspace.createFileSystemWatcher(
		new RelativePattern(globalHome, ".github/copilot-instructions.md")
	);
	const projectCopilotMdWatcher = workspace.createFileSystemWatcher(
		"**/copilot-instructions.md"
	);

	globalCopilotMdWatcher.onDidCreate(() => steeringExplorer.refresh());
	globalCopilotMdWatcher.onDidDelete(() => steeringExplorer.refresh());
	projectCopilotMdWatcher.onDidCreate(() => steeringExplorer.refresh());
	projectCopilotMdWatcher.onDidDelete(() => steeringExplorer.refresh());

	context.subscriptions.push(globalCopilotMdWatcher, projectCopilotMdWatcher);
};
