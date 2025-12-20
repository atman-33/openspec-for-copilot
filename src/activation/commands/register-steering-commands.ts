import { commands } from "vscode";
import type { ExtensionContext } from "vscode";
import type { SteeringExplorerProvider } from "../../providers/steering-explorer-provider";
import type { ExtensionServices } from "../extension-services";

export const registerSteeringCommands = (
	context: ExtensionContext,
	services: ExtensionServices,
	steeringExplorer: SteeringExplorerProvider
) => {
	const { outputChannel, steeringManager } = services;

	context.subscriptions.push(
		commands.registerCommand(
			"openspec-for-copilot.steering.createUserRule",
			async () => {
				await steeringManager.createUserConfiguration();
			}
		),
		commands.registerCommand(
			"openspec-for-copilot.steering.createProjectRule",
			async () => {
				await steeringManager.createProjectDocumentation();
			}
		),
		commands.registerCommand("openspec-for-copilot.steering.refresh", () => {
			outputChannel.appendLine(
				"[Manual Refresh] Refreshing steering explorer..."
			);
			steeringExplorer.refresh();
		})
	);
};
