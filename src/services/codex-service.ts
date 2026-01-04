import { homedir } from "os";
import { dirname, join } from "path";
import { randomUUID } from "crypto";
import { Position, Selection, Uri, commands, window, workspace } from "vscode";

export class CodexService {
	static addPromptToThread = async (prompt: string): Promise<void> => {
		const targetUri = this.buildCodexTempFileUri();
		await this.writeTempFile(targetUri, prompt);

		const document = await workspace.openTextDocument(targetUri);
		const editor = await window.showTextDocument(document);

		this.selectAll(editor, document);

		await commands.executeCommand("chatgpt.addToThread");
	};

	private static buildCodexTempFileUri = (): ReturnType<typeof Uri.file> => {
		const now = new Date();
		const yyyymmdd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
		const uuid = randomUUID();

		const dir = join(homedir(), ".codex", ".tmp");
		const filename = `${yyyymmdd}-${uuid}.md`;

		return Uri.file(join(dir, filename));
	};

	private static writeTempFile = async (
		uri: ReturnType<typeof Uri.file>,
		content: string
	): Promise<void> => {
		const dirUri = Uri.file(dirname(uri.fsPath));
		await workspace.fs.createDirectory(dirUri);
		await workspace.fs.writeFile(uri, new TextEncoder().encode(content));
	};

	private static selectAll = (
		editor: { selection: unknown },
		document: { lineCount: number; lineAt: (line: number) => { text: string } }
	): void => {
		const start = new Position(0, 0);
		const lastLine = Math.max(0, document.lineCount - 1);
		const lastChar = document.lineAt(lastLine).text.length;
		const end = new Position(lastLine, lastChar);

		editor.selection = new Selection(start, end);
	};
}
