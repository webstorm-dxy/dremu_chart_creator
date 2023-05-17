export async function checkToken(token: string) {
    return new Promise<boolean>(async(resolve, reject) => {
        const res = await fetch('/api/checkToken/', {
            mode: "cors",
            body: token,
            cache: "no-cache",
            method: 'POST'
        }).then(v => v.text());
        resolve(res === 'true');
    });
}

export function login() {
    open('/file-manager', '_self');
}

export async function checkTokenAndLogin(token: string) {
    if (await checkToken(token)) login();
}