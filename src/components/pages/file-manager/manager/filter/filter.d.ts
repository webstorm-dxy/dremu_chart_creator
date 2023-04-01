import { SearchProps } from "@components/search/search";

export type FilterProps<T extends unknown[] = unknown[]> = {
    set: Function;
    contents: T;
    filter: SearchProps<T>['filter'];
}