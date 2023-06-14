import { FsOptions, exists, writeTextFile, readTextFile as tauriReadTextFile } from "@tauri-apps/api/fs";

export function readTextFile(path: string, options?: FsOptions) {
    return exists(path, options).then(async(has) => {
        if(!has) await writeTextFile(path, '', options);
        return tauriReadTextFile(path, options);
    });
}