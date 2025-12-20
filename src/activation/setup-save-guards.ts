import type { ExtensionContext } from "vscode";
import { window, workspace } from "vscode";

export const setupSaveGuards = (context: ExtensionContext) => {
	context.subscriptions.push(
		workspace.onWillSaveTextDocument(async (event) => {
			const document = event.document;
			const filePath = document.fileName;

			if (filePath.includes(".copilot/agents/") && filePath.endsWith(".md")) {
				const result = await window.showWarningMessage(
					"Are you sure you want to save changes to this agent file?",
					{ modal: true },
					"Save",
					"Cancel"
				);

				if (result !== "Save") {
					// Cancel the save operation by waiting forever
					// biome-ignore lint/suspicious/noEmptyBlockStatements: ignore
					event.waitUntil(new Promise(() => {}));
				}
			}
		})
	);
};
