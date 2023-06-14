import { FsDirOptions, readDir, removeFile, removeDir as tRemoveDir } from "@tauri-apps/api/fs";
import getPath from "./get-path";

export async function removeDir(path: string, options?: FsDirOptions) {
    const files = await readDir(path, options);

    for await (const file of files) {
        file.children
            ? await removeDir(getPath(path, file.name), options)
            : await removeFile(getPath(path, file.name), options);
    }

    tRemoveDir(path, options);
}