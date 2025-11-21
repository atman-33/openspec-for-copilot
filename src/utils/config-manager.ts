import { join } from "path";
import { type WorkspaceFolder, workspace } from "vscode";
import {
	DEFAULT_CONFIG,
	DEFAULT_PATHS,
	DEFAULT_VIEW_VISIBILITY,
	VSC_CONFIG_NAMESPACE,
} from "../constants";
export interface OpenSpecSettings {
	paths: {
		specs: string;
		prompts: string;
	};
	views: {
		specs: { visible: boolean };
		steering: { visible: boolean };
		prompts: { visible: boolean };
		settings: { visible: boolean };
	};
	chatLanguage: string;
}

export class ConfigManager {
	private static instance: ConfigManager;
	private settings: OpenSpecSettings | null = null;
	private readonly workspaceFolder: WorkspaceFolder | undefined;

	// Internal constants
	private static readonly TERMINAL_VENV_ACTIVATION_DELAY = 800; // ms

	private constructor() {
		this.workspaceFolder = workspace.workspaceFolders?.[0];
	}

	static getInstance(): ConfigManager {
		if (!ConfigManager.instance) {
			ConfigManager.instance = new ConfigManager();
		}
		return ConfigManager.instance;
	}

	// biome-ignore lint/suspicious/useAwait: ignore
	async loadSettings(): Promise<OpenSpecSettings> {
		const settings = this.getDefaultSettings();
		this.settings = settings;
		return settings;
	}

	getSettings(): OpenSpecSettings {
		if (!this.settings) {
			this.settings = this.getDefaultSettings();
		}
		return this.settings;
	}

	getPath(type: keyof typeof DEFAULT_PATHS): string {
		const settings = this.getSettings();
		return settings.paths[type] ?? DEFAULT_PATHS[type];
	}

	getAbsolutePath(type: keyof typeof DEFAULT_PATHS): string {
		if (!this.workspaceFolder) {
			throw new Error("No workspace folder found");
		}
		return join(this.workspaceFolder.uri.fsPath, this.getPath(type));
	}

	getTerminalDelay(): number {
		return ConfigManager.TERMINAL_VENV_ACTIVATION_DELAY;
	}

	private getConfiguredPaths(): Partial<
		Record<keyof typeof DEFAULT_PATHS, string>
	> {
		const config = workspace.getConfiguration(VSC_CONFIG_NAMESPACE);
		const promptsPath = config.get<string>("copilot.promptsPath")?.trim();
		const specsPath = config.get<string>("copilot.specsPath")?.trim();

		const configuredPaths: Partial<Record<keyof typeof DEFAULT_PATHS, string>> =
			{};

		if (promptsPath) {
			configuredPaths.prompts = promptsPath;
		}

		if (specsPath) {
			configuredPaths.specs = specsPath;
		}

		return configuredPaths;
	}

	private getChatLanguage(): string {
		const config = workspace.getConfiguration(VSC_CONFIG_NAMESPACE);
		return config.get<string>("chatLanguage") ?? DEFAULT_CONFIG.chatLanguage;
	}

	private mergeSettings(
		defaults: OpenSpecSettings,
		overrides: Partial<OpenSpecSettings> = {}
	): OpenSpecSettings {
		const mergedPaths = {
			...defaults.paths,
			...(overrides.paths ?? {}),
		};

		const mergedViews = {
			specs: {
				visible:
					overrides.views?.specs?.visible ?? defaults.views.specs.visible,
			},
			steering: {
				visible:
					overrides.views?.steering?.visible ?? defaults.views.steering.visible,
			},
			prompts: {
				visible:
					overrides.views?.prompts?.visible ?? defaults.views.prompts.visible,
			},
			settings: {
				visible:
					overrides.views?.settings?.visible ?? defaults.views.settings.visible,
			},
		};

		return {
			paths: mergedPaths,
			views: mergedViews,
			chatLanguage: overrides.chatLanguage ?? defaults.chatLanguage,
		};
	}

	private getDefaultSettings(): OpenSpecSettings {
		const configuredPaths = this.getConfiguredPaths();
		const chatLanguage = this.getChatLanguage();

		return {
			paths: { ...DEFAULT_PATHS, ...configuredPaths },
			views: {
				specs: { visible: DEFAULT_VIEW_VISIBILITY.specs },
				steering: { visible: DEFAULT_VIEW_VISIBILITY.steering },
				prompts: { visible: DEFAULT_VIEW_VISIBILITY.prompts },
				settings: { visible: DEFAULT_VIEW_VISIBILITY.settings },
			},
			chatLanguage,
		};
	}
	// biome-ignore lint/suspicious/useAwait: ignore
	async saveSettings(settings: OpenSpecSettings): Promise<void> {
		this.settings = this.mergeSettings(this.getDefaultSettings(), settings);
	}
}
