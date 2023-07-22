/** 页面跳转管理工具 */

import { isLogined } from "../user/login";

/** 页面表 */
export enum Pages {
    LOGIN,
    DASH_BOARD,
    EDITOR
}

/** 跳转页面函数 */
export default function turnTo(page: Pages, args?: Record<string, string>): void {
    // ! 登录状况检查
    // if(!isLogined() && page !== Pages.LOGIN) return turnTo(Pages.LOGIN);

    // 获取并格式化url参数
    const argsInUrl = args ? Object.keys(args).map((key, i) => {
        const value = args[key];

        return (i ? ',' : '') + `${key}=${value}`;
    }) : '';

    function openPage(url: string): void {
        open(url + '?' + argsInUrl, '_self');
    }

    switch (page) {
        case Pages.EDITOR: return openPage('/editor');
        case Pages.DASH_BOARD: return openPage('/dash-board');
        case Pages.LOGIN: return openPage('/login');
    }
}