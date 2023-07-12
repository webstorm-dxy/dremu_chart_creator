import { Graphics, TextStyle } from "pixi.js";
import { _ReactPixi } from "@pixi/react";
import { IChartLine } from "@/interfaces/chart-data/chart-data";
import Bpm from "@/scripts/chart-data/bpm/bpm";


export interface PointProps extends _ReactPixi.IContainer {
    position?: Vec2;
    draw?: (g: Graphics) => void;
    color?: number;
    text?: string;
    textStyle?: TextStyle;
    graphicsProps?: _ReactPixi.IGraphics;
    children?: never;
}

export interface LineProps {
    data: IChartLine;
    bpm: Bpm;
    time: number;
}