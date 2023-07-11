import { CSSProperties } from "react";

export interface IconProps{
    icon: string;
    className?: string;
    type?: 'brands'|'solid';
    fillType?: 'sharp'|'classic';
    sty?: CSSProperties;
}