export enum Pages {
    LOGIN,
    FILE_MANAGER,
    EDITOR
}

export default function turnTo(page: Pages, args?: Record<string, string>) {
    const argsInUrl = args ? Object.keys(args).map((key, i) => {
        const value = args[key];

        return (i ? ',' : '') + `${key}=${value}`;
    }) : '';

    function openPage(url: string): void {
        open(url + '?' + argsInUrl, '_self');
    }

    switch (page) {
        case Pages.EDITOR: return openPage('/editor');
        case Pages.FILE_MANAGER: return openPage('/file-manager');
        case Pages.LOGIN: return openPage('/login');
    }
}