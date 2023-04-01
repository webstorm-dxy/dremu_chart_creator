import MD5 from 'crypto-js/md5';

export function createMd5(base?: string): string {
    return MD5(base ?? (Math.random() * 0.8 + 0.1 + new Date().getTime()).toString()).toString();
}