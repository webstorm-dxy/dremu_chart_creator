import { message } from "antd";

let connected = false;
let waiting = false;

export const previewConnected = () => connected;

export function connectPreview(force: boolean=false): Promise<boolean> {
    const isWaiting = waiting;
    return new Promise<boolean>(async (resolve) => {
        if (isWaiting && !force) { message.warning('等待上一个请求返回中'); return resolve(false); }
        waiting = true;
        if (connected) { message.info('预览器已连接'); return resolve(true); }

        message.info('正在连接预览器');
        const res = await fetch('http://127.0.0.1:2674', {
            method: 'GET',
            mode: 'cors'
        })
            .then(res => res.text())
            .catch(err => { message.error('连接预览器失败, 错误:' + err, 10000); waiting = false; resolve(false); });

        if (res !== 'OK') return resolve(false);

        // eslint-disable-next-line require-atomic-updates
        connected = true;
        message.success('预览器连接成功');
        return resolve(true);
    }).finally(() => isWaiting || (waiting = false));
}

export function disconnectPreview(force: boolean=false): boolean {
    if (waiting && !force) { message.warning('等待上一个请求返回中'); return false; }
    waiting = true;
    if (!connected) { message.warning('预览器未连接'); return true; }

    connected = false;
    message.success('预览器断开连接成功');
    waiting=false;
    return true;
}

export function fetchToPreview(startTime: number, chartPath: string, audioPath: string): Promise<boolean> {
    const isWaiting = waiting;
    return new Promise<boolean>(async (resolve) => {
        if (isWaiting) { message.warning('等待上一个请求返回中'); return resolve(false); }
        waiting = true;
        if (!connected) { message.warning('预览器未连接'); return resolve(false); }

        const res = await fetch('http://127.0.0.1:2674/url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            mode: 'cors',
            body: JSON.stringify({
                chartPath,
                audioPath,
                startTime
            })
        });

        if (res.status !== 200) {
            message.error('预览失败, 响应信息: ' + res, 10000);

            waiting = false;
            disconnectPreview();
            return resolve(false);
        }

        message.success('预览器预览成功');
        return resolve(true);
    }).finally(() => isWaiting || (waiting = false));
}