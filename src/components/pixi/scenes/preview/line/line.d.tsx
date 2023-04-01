import ChartLine from "@scripts/chart-data/line";
import { Graphics, TextStyle } from "pixi.js";
import { _ReactPixi } from "@pixi/react";
import { Vec2 } from "@/interfaces/global-type";
import { LineEvents } from "@/interfaces/chart-data/event/line-events";

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
    data: ChartLine;
    time: number;
}