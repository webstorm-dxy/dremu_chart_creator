import { InputHTMLAttributes } from "react";

export interface SearchProps<T extends unknown[] = unknown[]> extends InputHTMLAttributes<HTMLInputElement> {
    set: Function;
    contents: T;
    filter: (v, i, arr) => T;
}