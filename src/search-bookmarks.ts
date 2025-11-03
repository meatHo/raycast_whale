import { List, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { exec } from "child_process";
import { useEffect, useState } from "react";

interface Bookmark {
    title: string;
    url: string;
}

export default function Command() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const script = `
      tell application "Whale.app"
        set bmList to {}
        try
          set bms to bookmark items of bookmarks bar
          repeat with bm in bms
            set end of bmList to (title of bm & "||" & URL of bm)
          end repeat
        on error errMsg
          return errMsg
        end try
        return bmList as string
      end tell
    `;

        exec(`osascript -e '${script}'`, (error, stdout) => {
            if (error) {
                showToast({
                    style: Toast.Style.Failure,
                    title: "AppleScript 실행 실패",
                    message: error.message,
                });
                setLoading(false);
                return;
            }

            const lines = stdout.split(",").map((line) => line.trim());
            const items = lines
                .map((l) => l.split("||"))
                .filter((arr) => arr.length === 2)
                .map(([title, url]) => ({ title, url }));

            setBookmarks(items);
            setLoading(false);
        });
    }, []);

    return (
        <List isLoading= { isLoading } searchBarPlaceholder = "Search Whale Bookmarks..." >
            {
                bookmarks.map((bm, i) => (
                    <List.Item
        key= { i }
        title = { bm.title }
        subtitle = { bm.url }
        actions = {
          < ActionPanel >
                    <Action title="Open in Whale" onAction = {() => exec(`open -a "Whale.app" "${bm.url}"`)} />
            <Action.CopyToClipboard title="Copy URL" content = { bm.url } />
                </ActionPanel>
}
      />
    ))}
</List>
);
