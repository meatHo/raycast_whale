import { exec } from "child_process";
import { showHUD } from "@raycast/api";

export default async function Command() {
    const script = `
    tell application "Whale.app" to make new window with properties {mode:"incognito"}
  `;

    exec(`osascript -e '${script}'`, (error) => {
        if (error) {
            showHUD("create new incognito window Failed");
            console.error(error);
            return;
        }
        showHUD("create new incognito window Succeded");
    });
}
