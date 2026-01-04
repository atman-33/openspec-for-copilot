import { describe, expect, it, vi } from "vitest";
import { commands, window, workspace } from "vscode";

vi.mock("os", () => ({
	homedir: () => "/home/test",
}));

vi.mock("crypto", () => ({
	randomUUID: () => "uuid-test",
}));

describe("CodexService", () => {
	it("writes a temp file and calls chatgpt.addToThread", async () => {
		const { CodexService } = await import("./codex-service");

		vi.mocked(workspace.openTextDocument).mockResolvedValue({
			lineCount: 1,
			lineAt: () => ({ text: "hello" }),
		} as any);

		vi.mocked(window.showTextDocument).mockResolvedValue({
			selection: undefined,
		} as any);

		await CodexService.addPromptToThread("hello");

		expect(workspace.fs.createDirectory).toHaveBeenCalled();
		expect(workspace.fs.writeFile).toHaveBeenCalled();
		expect(commands.executeCommand).toHaveBeenCalledWith("chatgpt.addToThread");
	});
});
