import type { OutputChannel } from "vscode";
import type { SpecManager } from "../features/spec/spec-manager";
import type { SteeringManager } from "../features/steering/steering-manager";
import type { CopilotProvider } from "../providers/copilot-provider";
import type { ConfigManager } from "../utils/config-manager";

export interface ExtensionServices {
	outputChannel: OutputChannel;
	configManager: ConfigManager;
	specManager: SpecManager;
	steeringManager: SteeringManager;
	copilotProvider: CopilotProvider;
}
