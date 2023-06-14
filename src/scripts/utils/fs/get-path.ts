export default function getPath(...path: string[]): string {
    return path.map(v => {
        const res = v.replaceAll('\\', '/');
        return res.slice(res[0] === '/' ? 1 : 0, res[res.length - 1] === '/' ? -1 : res.length);
    }).join('/');
}