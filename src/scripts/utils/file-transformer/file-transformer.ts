import Base64 from 'crypto-js/enc-base64';


export function blobToFile(blob: Blob, filename: string, option?) {
    return new File([blob], filename, option);
}

export async function fileToBase64(file: File) : Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            resolve(ev.target.result as string);
        };
        reader.onerror = (err) => {
            reject(err);
        };
        reader.readAsDataURL(file);
    });
}

export function base64ToFile(base64Str: string, filename, option?) {
    const blob = base64ToBlob(base64Str);
    return new File([blob], filename, {type: blob.type, ...option});
}

export function base64ToBlob(base64Str: string, option?) {
    const arr = base64Str.split(',');
    const type = arr[0].match(/:(.*?);/)[1];
    const base64 = Base64.parse(arr[1]).toString();
    let n = base64.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = base64.charCodeAt(n);
    }
    return new Blob([u8arr], {type, ...option});
}