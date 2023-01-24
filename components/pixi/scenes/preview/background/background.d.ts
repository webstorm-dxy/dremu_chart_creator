import { Texture } from "pixi.js";

export interface BackgroundProps{
    texture: Texture;
    viewWidth: number;
    viewHeight: number;
    mask?: boolean;
    zIndex?: number;
}

// export interface BackgroundState {
//     mask: boolean;
// }