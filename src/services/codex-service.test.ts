import { beforeEach, describe, expect, it, vi } from "vitest";
import { FileType, commands, window, workspace } from "vscode";

vi.mock("os", () => ({
	homedir: () => "/home/test",
}));

vi.mock("crypto", () => ({
	randomUUID: () => "uuid-test",
}));

describe("CodexService", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("writes a temp file and calls chatgpt.addToThread", async () => {
		const { CodexService } = await import("./codex-service");

		vi.mocked(workspace.fs.readDirectory).mockResolvedValue([] as any);

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

	it("deletes .md files older than 7 days (best-effort)", async () => {
		const { CodexService } = await import("./codex-service");
		const now = Date.now();
		const eightDaysMs = 8 * 24 * 60 * 60 * 1000;

		vi.mocked(workspace.fs.readDirectory).mockResolvedValue([
			["old.md", FileType.File],
		] as any);
		vi.mocked(workspace.fs.stat).mockResolvedValue({
			mtime: now - eightDaysMs,
		} as any);
		vi.mocked(workspace.openTextDocument).mockResolvedValue({
			lineCount: 1,
			lineAt: () => ({ text: "hello" }),
		} as any);
		vi.mocked(window.showTextDocument).mockResolvedValue({
			selection: undefined,
		} as any);

		await CodexService.addPromptToThread("hello");

		expect(workspace.fs.delete).toHaveBeenCalled();
	});

	it("does not delete recent .md files", async () => {
		const { CodexService } = await import("./codex-service");
		const now = Date.now();
		const oneDayMs = 1 * 24 * 60 * 60 * 1000;

		vi.mocked(workspace.fs.readDirectory).mockResolvedValue([
			["recent.md", FileType.File],
		] as any);
		vi.mocked(workspace.fs.stat).mockResolvedValue({
			mtime: now - oneDayMs,
		} as any);
		vi.mocked(workspace.openTextDocument).mockResolvedValue({
			lineCount: 1,
			lineAt: () => ({ text: "hello" }),
		} as any);
		vi.mocked(window.showTextDocument).mockResolvedValue({
			selection: undefined,
		} as any);

		await CodexService.addPromptToThread("hello");

		expect(workspace.fs.delete).not.toHaveBeenCalled();
	});
});
