

export type Int = number;

export {Vec2};
export {Vec3};
export {Vec4};

export type Class = new (...args: any[]) => {};
export type ClassFunction = Function;
export type Merge<T, K = keyof T> = Record<K, T[K]>;
export type Method<T extends Function = Function> = T;