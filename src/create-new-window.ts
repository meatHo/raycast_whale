import { exec } from "child_process";
import { showHUD } from "@raycast/api";

export default async function Command() {
    const script = `
    tell application "Whale.app" to make new window
  `;

    exec(`osascript -e '${script}'`, (error) => {
        if (error) {
            showHUD("create new window Failed");
            console.error(error);
            return;
        }
        showHUD("create new window Succeded");
    });
}
