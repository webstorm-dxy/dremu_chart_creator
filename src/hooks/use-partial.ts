import { useMemo } from "react";


export function usePartial<T extends unknown | unknown[]>(_args: T, _defaultValue: T): T {
    /**
     * @description 将可选值 (undefined) 转为默认值
     * @param {T} args 需要处理的参数
     * @param {T} defaultValue 对应下标的参数为undefined时使用的默认值，当此参数的长度不足时默认取最后一个值为默认值
     */
    // useMemo 减少计算
    return useMemo((): T => {
        const isArr = _args instanceof Array;

        // 将单参数转为数组，方便处理
        let args: unknown[] = _args as unknown[];
        let defaultValue: unknown[] = _defaultValue as unknown[];

        if (!(isArr)) {
            args = [args];
            defaultValue = [defaultValue];
        }

        // 判空
        if (!(args.length || defaultValue.length)) {
            throw new Error('params has void array');
        }

        // 单次处理函数
        function dispose(arg: unknown, defaultValue: unknown): unknown {
            if (arg === undefined) arg = defaultValue;

            return arg as unknown;
        }

        // 返回单参数
        if (!isArr) return dispose(args[0], defaultValue[0]) as T;

        // 返回结果
        const len = defaultValue.length;
        return args.map((v, i) => dispose(v, defaultValue[i < len ? i : len - 1])) as T;
    }, [_args, _defaultValue]);
}