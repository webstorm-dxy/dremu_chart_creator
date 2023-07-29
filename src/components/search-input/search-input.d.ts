import { SearchProps } from "@/components/search-input/search/search";
import { FormEventHandler } from "react";

export interface SearchInputProps extends SearchProps {
    placeHolder?: string;
    onInput?: FormEventHandler<HTMLInputElement>;
    onSearch?: Function;
}

export interface SearchInputState {
    value: string;
}