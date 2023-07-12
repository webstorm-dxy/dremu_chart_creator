/* eslint-disable @typescript-eslint/no-explicit-any */
import {ThrottleSettings, throttle as _throttle} from 'lodash';

const callbacks = new Map<(...args: any) => any, (...args: any) => any>();

export default function throttle(func: (...args: any) => any, wait?: number, options?: ThrottleSettings) {
    if (!wait) callbacks.delete(func);
    else if (callbacks.has(func)) callbacks.get(func)();
    else {
        callbacks.set(func, _throttle(func, wait, options));
        throttle(func, wait, options);
    }
}