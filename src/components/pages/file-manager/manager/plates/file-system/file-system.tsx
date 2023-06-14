import Icon from "@/components/icon/icon";
import { createWindow } from "@/scripts/manager/window-manager";
import { useBoolean } from "ahooks";
import { Button, Space } from "antd";
import { useEffect, useMemo, useState } from "react";

/** @type {import('@tauri-apps/api').shell} */
let shell;

(async () => shell = (await import('@tauri-apps/api')).shell)();

const fileSystemUrl = "https://file.vestar.games/s/5ZIM";

function createKey() {
    return Math.random().toString();
}

export default function FileSystem() {
    const [shellReadied, { setTrue: setShellReadied }] = useBoolean(false);
    const [key, setKey] = useState<string>(useMemo(createKey, []));

    function changeKey() {
        setKey(createKey());
    }

    useEffect(() => {
        if (shell) setShellReadied();
        else shell = import('@tauri-apps/api').then(v => { shell = v.shell; setShellReadied(); });
    }, [shell]);

    return <div className="h-full w-full">
        <div className="w-full h-10 flex justify-between items-center p-2 bg-gray-200">
            <Space className="flex-initial">
                <Button onClick={changeKey} shape="circle"><Icon icon="home" /></Button>
            </Space>
            <Space className="flex-initial">
                <Button onClick={() => { createWindow('file-system', { url: fileSystemUrl }); }}>在新窗口打开</Button>
                <Button onClick={() => shell.open(fileSystemUrl)}
                    disabled={!shellReadied} loading={!shellReadied}>
                    在浏览器中打开
                </Button>
            </Space>
        </div>
        <iframe key={key} className="border-none"
            width='100%' height='100%'
            src={fileSystemUrl}
            onContextMenu={(e) => e.preventDefault()}
        />
    </div>;
}