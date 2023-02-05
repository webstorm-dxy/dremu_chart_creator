import { CSSProperties } from "react";

export interface IconProps{
    icon: string;
    type?: 'brands'|'solid';
    fillType?: 'sharp'|'classic';
    sty?: CSSProperties;
}