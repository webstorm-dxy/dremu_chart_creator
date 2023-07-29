import { Graphics } from "pixi.js";
import { PropsWithChildren } from "react";

type GraphicsMaskProps = PropsWithChildren<{
    draw: (graphics: Graphics) => void;
    show?: boolean;
    position?: [number, number];
    rotation?: number;
    scale?: [number, number];
}>;