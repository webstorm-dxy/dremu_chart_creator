import { FormEventHandler } from "react";

export interface SearchInputProps {
    defaultValue?: string;
    value?: string;
    placeHolder?: string;
    max?: number;
    min?: number;
    onInput?: FormEventHandler<HTMLInputElement>;
    onSearch?: Function;
}

export interface SearchInputState {
    value: string;
}