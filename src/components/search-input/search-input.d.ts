import { SearchProps } from "@components/search/search.d";
import { FormEventHandler } from "react";

export interface SearchInputProps extends SearchProps {
    placeHolder?: string;
    onInput?: FormEventHandler<HTMLInputElement>;
    onSearch?: Function;
}

export interface SearchInputState {
    value: string;
}