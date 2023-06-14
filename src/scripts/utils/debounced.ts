import {DebounceSettings, debounce as _debounce} from 'lodash';

const callbacks = new Map<(...args: any) => any, (...args: any) => any>();

export default function debounce(func: (...args: any) => any, wait?: number, options?: DebounceSettings) {
    if (!wait) callbacks.delete(func);
    else if (callbacks.has(func)) callbacks.get(func)();
    else callbacks.set(func, _debounce(func, wait, options));
}