declare type Int = number;
declare type Class = new (...args: any[]) => {};
declare type ClassFunction = Function;
declare type Merge<T, K = keyof T> = Record<K, T[K]>;
declare type Method<T extends Function = Function> = T;