import type { ExtensionContext } from "vscode";
import type { PromptsExplorerProvider } from "../providers/prompts-explorer-provider";
import type { SpecExplorerProvider } from "../providers/spec-explorer-provider";
import type { SteeringExplorerProvider } from "../providers/steering-explorer-provider";
import type { ExtensionServices } from "./extension-services";
import { registerSettingsCommands } from "./commands/register-settings-commands";
import { registerSteeringCommands } from "./commands/register-steering-commands";
import { registerSpecCommands } from "./commands/register-spec-commands";
import { registerPromptsCommands } from "./commands/register-prompts-commands";

export const registerCommands = (
	context: ExtensionContext,
	services: ExtensionServices,
	explorers: {
		specExplorer: SpecExplorerProvider;
		steeringExplorer: SteeringExplorerProvider;
		promptsExplorer: PromptsExplorerProvider;
	}
) => {
	registerSpecCommands(context, services, explorers.specExplorer);
	registerSteeringCommands(context, services, explorers.steeringExplorer);
	registerPromptsCommands(context, services, explorers.promptsExplorer);
	registerSettingsCommands(context, services);
};
