import { Texture } from "pixi.js";

export interface BackgroundProps{
    texture: Texture;
    width: number;
    height: number;
    mask?: boolean;
    zIndex?: number;
}

// export interface BackgroundState {
//     mask: boolean;
// }