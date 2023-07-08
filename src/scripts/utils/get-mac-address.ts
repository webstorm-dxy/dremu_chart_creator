import { MD5 as md5 } from 'crypto-js';

let invoke: Function;

(async () => {
    invoke = (await import('@tauri-apps/api')).invoke;

    // 初始化
    getMacAddress();
})();

export type IMacAddress = string | null;

let macAddressMd5: Readonly<string> = '';

function setMacAddress(mac: string) {
    if (macAddressMd5 || !mac) return macAddressMd5;
    macAddressMd5 = md5(mac).toString();
    return macAddressMd5;
}

export async function getMacAddress(): Promise<string> {
    return new Promise<IMacAddress>((resolve, reject) => {
        if (macAddressMd5) return resolve(macAddressMd5);
        if (!invoke) {
            reject('Tauri api - invoke is not loaded');
            return;
        }
        invoke('get_mac_address')
            .then((res: string) => {
                return resolve(setMacAddress(res));
            });
    });
}