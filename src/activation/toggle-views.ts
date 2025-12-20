import { ConfigurationTarget, window, workspace } from "vscode";
import { VSC_CONFIG_NAMESPACE } from "../constants";

export const toggleViews = async () => {
	const config = workspace.getConfiguration(VSC_CONFIG_NAMESPACE);
	const currentVisibility = {
		specs: config.get("views.specs.visible", true),
		hooks: config.get("views.hooks.visible", false),
		steering: config.get("views.steering.visible", true),
		mcp: config.get("views.mcp.visible", false),
	};

	const items: Array<{ label: string; picked: boolean; id: string }> = [
		{
			label: `$(${currentVisibility.specs ? "check" : "blank"}) Specs`,
			picked: currentVisibility.specs,
			id: "specs",
		},
		{
			label: `$(${currentVisibility.steering ? "check" : "blank"}) Agent Steering`,
			picked: currentVisibility.steering,
			id: "steering",
		},
	];

	const selected = await window.showQuickPick(items, {
		canPickMany: true,
		placeHolder: "Select views to show",
	});

	if (!selected) {
		return;
	}

	const newVisibility = {
		specs: selected.some((item) => item.id === "specs"),
		hooks: selected.some((item) => item.id === "hooks"),
		steering: selected.some((item) => item.id === "steering"),
		mcp: selected.some((item) => item.id === "mcp"),
	};

	await config.update(
		"views.specs.visible",
		newVisibility.specs,
		ConfigurationTarget.Workspace
	);
	await config.update(
		"views.steering.visible",
		newVisibility.steering,
		ConfigurationTarget.Workspace
	);

	window.showInformationMessage("View visibility updated!");
};
