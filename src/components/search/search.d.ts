import { Int } from "@interfaces/global-type";
import { InputHTMLAttributes } from "react";

export interface SearchProps<T extends unknown[] = unknown[]> extends InputHTMLAttributes<HTMLInputElement> {
    set: Function;
    contents: T;
    filter: (contents: T, value: string, index: Int, array: string[]) => T;
}