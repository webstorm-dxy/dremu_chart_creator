import { Texture } from "pixi.js";
import { PropsWithChildren } from "react";

export type TextureMaskProps = PropsWithChildren<{
    texture: Texture;
}>;