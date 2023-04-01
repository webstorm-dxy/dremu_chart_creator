import { BaseDirectory } from "@tauri-apps/api/fs";
import { readBinary, writeBinary } from "./binary";

export async function saveAudio(name: string, contents: ArrayBuffer|Blob|File) {
    return writeBinary('audio/' + name, contents, {dir: BaseDirectory.Resource});
}

export async function getAudio(name: string) {
    return readBinary('audio/' + name, {dir: BaseDirectory.Resource});
}