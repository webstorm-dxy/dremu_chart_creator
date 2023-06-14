import { BaseDirectory, removeFile, writeTextFile } from "@tauri-apps/api/fs";
import { readTextFile } from "../utils/fs/readFile";

export async function checkToken(token: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
        // 禁止自动登录
        // return resolve(false);

        if(!checkTokenFormat(token)) return resolve(false);

        const res = await fetch('/api/checkToken/', {
            mode: "cors",
            body: token,
            cache: "no-cache",
            method: 'POST'
        }).then(async(v) => await v.text() === 'true');

        if(!res) await deleteToken();
        resolve(res);
    });
}

function checkTokenFormat(token: string): boolean {
    const res = /^[a-z0-9+=/]{44,}$/i.test(token);
    if (!res) deleteToken();
    return res;
}

export function saveToken(token: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        if (!checkTokenFormat(token)) resolve(false);
        
        writeTextFile('token', token, { dir: BaseDirectory.Resource })
            .then(() => resolve(true))
            .catch(err => reject(err));
    });
}

function readToken() :Promise<string> {
    return readTextFile('token', { dir: BaseDirectory.Resource });
}

export function getToken(): Promise<string> {
    return readToken().then(value => value);
}

export function deleteToken() {
    return removeFile('token', {dir: BaseDirectory.Resource});
}