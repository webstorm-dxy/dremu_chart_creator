let invoke: Function;

(async () => {
    invoke = (await import('@tauri-apps/api')).invoke;
})();

export type IMacAddress = string|null;

export default async function getMacAddress() {
    return new Promise<IMacAddress>((resolve, reject) => {
        if (!invoke) {
            reject('Tauri api - invoke is not loaded');
            return;
        }
        invoke('get_mac_address')
            .then((res: string) => {
                console.log("mac", res);
                
                if (res) resolve(res);
                resolve(null);
            });
    });
}