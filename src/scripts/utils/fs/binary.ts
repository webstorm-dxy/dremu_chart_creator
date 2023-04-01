import { createDir, exists, FsOptions, readBinaryFile, writeBinaryFile } from "@tauri-apps/api/fs";
import { toArrayBuffer } from "./toArrayBuffer";

export async function writeBinary(path: string, contents: ArrayBuffer|Blob|File, options: FsOptions) {
    let arrBuf: ArrayBuffer;
    if (contents instanceof Blob || contents instanceof File) {
        arrBuf = await toArrayBuffer(contents);
    } else {
        arrBuf = contents;
    }
    
    if (!await exists(path, options)) createDir(path.slice(0, path.lastIndexOf('/') + 1), options);

    return writeBinaryFile(path, arrBuf, options);
}

export async function readBinary(path: string, options: FsOptions) {
    return readBinaryFile(path, options);
}