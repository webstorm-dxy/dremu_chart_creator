import { ChartEventArgs } from "./event";

export enum Themes {
    DEFAULT
}

export type ITheme = Themes;
export interface ChartThemeEventArgs extends ChartEventArgs {
    from?: ITheme;
    to?: ITheme; 
}