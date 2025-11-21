// VSCode configuration namespace for this extension
export const VSC_CONFIG_NAMESPACE = "openspec-for-copilot";

// Default configuration
export const DEFAULT_CONFIG = {
	paths: {
		prompts: ".github/prompts",
		specs: "openspec",
		steering: ".codex/steering",
	},
	views: {
		specs: true,
		steering: true,
		prompts: true,
		settings: false,
	},
} as const;

// Legacy exports for backward compatibility (can be removed after updating all references)
export const DEFAULT_PATHS = DEFAULT_CONFIG.paths;
export const DEFAULT_VIEW_VISIBILITY = DEFAULT_CONFIG.views;
