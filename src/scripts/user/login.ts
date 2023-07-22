import md5 from "crypto-js/md5";
import { getMacAddress } from "../utils/get-mac-address";
import { checkToken, getToken, saveToken } from "./token";
import turnTo, { Pages } from "../manager/page";
import { throttle } from 'lodash';
import globalConfigs from "../config";

interface ILoginOptions {
    username?: string;
    password?: string;
}

let logined: Readonly<boolean> = false;

function loginFunc(type: "token" | "password", options: ILoginOptions = {}): Promise<boolean> {
    return new Promise(async (resolve) => {
        // 登录方式判断并登录
        let res: false | string = false;

        if (type === 'token') res = await loginByToken();
        else if (type === 'password') res = await loginByPassword(options.username, options.password);
        else return resolve(false);

        // 检查
        if (!res) return resolve(false);
        if (!await checkToken(res)) return resolve(false);

        logined = true;
        resolve(true);
        // 成功则跳转页面
        turnToHome();
    });
}

const login: (
    ((type: 'token') => Promise<boolean>)
    & ((type: 'password', options: ILoginOptions) => Promise<boolean>)
) = throttle(loginFunc, 3000);

export function isLogined(): Readonly<boolean> {
    return logined;
}

function loginByToken(): Promise<false | string> {
    return new Promise<false | string>(async (resolve) => {
        const token = await getToken();

        if (!token) return resolve(false);

        logined = true;
        resolve(token);
    });
}

function loginByPassword(username: string, password: string) {
    return new Promise<false | string>(async (resolve) => {
        if (!username || !password) return resolve(false);

        const passwordMd5 = md5(password).toString();
        const macAddressMd5 = await getMacAddress();

        // 请求登录
        const res = await fetch(globalConfigs.api.login, {
            mode: 'cors',
            method: 'POST',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                passwordMd5,
                token: null,
                macAddressMd5
            })
        }).then(v => v.text());

        // 检查
        if (!res) return resolve(false);
        if (!await saveToken(res)) return resolve(false);

        if (res) logined = true;
        resolve(res);
    });
}

function turnToHome() {
    turnTo(Pages.DASH_BOARD);
}

export default login;