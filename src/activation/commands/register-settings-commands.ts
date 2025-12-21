import { commands, env, Uri, window, workspace } from "vscode";
import type { ExtensionContext } from "vscode";
import { VSC_CONFIG_NAMESPACE } from "../../constants";
import type { ExtensionServices } from "../extension-services";
import { toggleViews } from "../toggle-views";
import { getVSCodeUserDataPath } from "../../utils/platform-utils";
import { join } from "node:path";

const getMcpConfigPath = async (): Promise<string> => {
	const userDataPath = await getVSCodeUserDataPath();
	return join(userDataPath, "mcp.json");
};

export const registerSettingsCommands = (
	context: ExtensionContext,
	services: ExtensionServices
) => {
	const { outputChannel } = services;

	context.subscriptions.push(
		commands.registerCommand("openspec-for-copilot.settings.open", async () => {
			outputChannel.appendLine("Opening OpenSpec settings...");
			await commands.executeCommand(
				"workbench.action.openSettings",
				VSC_CONFIG_NAMESPACE
			);
		}),
		commands.registerCommand(
			"openspec-for-copilot.settings.openGlobalConfig",
			async () => {
				outputChannel.appendLine("Opening MCP config...");

				const configPath = await getMcpConfigPath();
				const configUri = Uri.file(configPath);

				try {
					await workspace.fs.stat(configUri);
				} catch {
					window.showWarningMessage(
						`MCP config not found at ${configUri.fsPath}.`
					);
					return;
				}

				try {
					const document = await workspace.openTextDocument(configUri);
					await window.showTextDocument(document, { preview: false });
				} catch (error) {
					const message =
						error instanceof Error ? error.message : String(error);
					window.showErrorMessage(`Failed to open MCP config: ${message}`);
				}
			}
		),
		// biome-ignore lint/suspicious/useAwait: ignore
		commands.registerCommand("openspec-for-copilot.help.open", async () => {
			outputChannel.appendLine("Opening OpenSpec help...");
			const helpUrl = "https://github.com/atman-33/openspec-for-copilot#readme";
			env.openExternal(Uri.parse(helpUrl));
		}),
		// biome-ignore lint/suspicious/useAwait: ignore
		commands.registerCommand("openspec-for-copilot.help.install", async () => {
			outputChannel.appendLine("Opening OpenSpec installation guide...");
			const installUrl = "https://github.com/Fission-AI/OpenSpec#readme";
			env.openExternal(Uri.parse(installUrl));
		}),
		commands.registerCommand("openspec-for-copilot.menu.open", async () => {
			outputChannel.appendLine("Opening OpenSpec menu...");
			await toggleViews();
		})
	);
};
