export type IMapKeyDeepFn<T = any> = (infos: {
    key: string,
    value: T,
    index: number;
    path: string[];
    parent: Record<string, any>;
}) => T;

export default function mapKeyDeep<T>(obj: Record<string, unknown>, fn: IMapKeyDeepFn, path: string[] = []): T[] {
    return Object.keys(obj).map((key, index) => {
        const value = obj[key];

        if (typeof value === 'object' && !(value instanceof Array)) return mapKeyDeep(value as Record<string, unknown>, fn, [...path, key]);
        const infos = {
            key,
            index,
            value,
            path,
            parent: obj
        };

        return fn?.(infos);
    }) as T[];
}