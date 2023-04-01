"use client";

import { createMd5 } from '@scripts/utils/crypto/md5';
import { WindowOptions } from '@/interfaces/tauri/window';


/** @type {import('@tauri-apps/api/window').WebviewWindow} */
let WebviewWindow, 
init: boolean = false;

const windows: Map<string | symbol, WebviewWindow> = new Map();
(async () => {
    WebviewWindow = (await import('@tauri-apps/api/window')).WebviewWindow;
    init = true;
})();


export function getWindow(id: string): WebviewWindow | Error | undefined {
    if (!init) throw new Error('window manager is not initialized');
    return windows[id];
}

export async function createWindow(id?: string | null, options?: WindowOptions): Promise<WebviewWindow> {
    return new Promise(async(resolve) => {
        if (!init) throw new Error('window manager is not initialized');
        id = id || createMd5();

        if (windows.has(id)) {
            await windows.get(id).close();
        }
        const view = new WebviewWindow(id, options);

        view.once('tauri://' + id, () => { });

        windows.set(id, view);
        view.onCloseRequested(() => {
            windows.delete(id);
        });

        resolve(view);
    });
}