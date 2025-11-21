import { exec } from "child_process";
import { homedir, release } from "os";
import { join } from "path";
import { promisify } from "util";

const WSL_REGEX = /microsoft|wsl/i;

export function isWindowsOrWsl(): boolean {
	return (
		process.platform === "win32" ||
		(process.platform === "linux" && WSL_REGEX.test(release()))
	);
}

export async function getVSCodeUserDataPath(): Promise<string> {
	const isWsl = process.platform === "linux" && WSL_REGEX.test(release());

	if (process.platform === "win32") {
		return join(process.env.APPDATA || "", "Code", "User");
	}

	if (isWsl) {
		try {
			const execAsync = promisify(exec);
			const { stdout: winAppData } = await execAsync(
				'cmd.exe /C "echo %APPDATA%"'
			);
			const trimmedWinAppData = winAppData.trim();
			const { stdout: wslPath } = await execAsync(
				`wslpath -u "${trimmedWinAppData}"`
			);
			const appDataPath = wslPath.trim();
			return join(appDataPath, "Code", "User");
		} catch (error) {
			console.error(`Failed to resolve Windows path in WSL: ${error}`);
			// Fallback to Linux path if resolution fails
		}
	}

	if (process.platform === "darwin") {
		return join(homedir(), "Library", "Application Support", "Code", "User");
	}

	return join(homedir(), ".config", "Code", "User");
}
