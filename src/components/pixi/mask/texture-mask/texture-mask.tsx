import { Container } from "@pixi/react";
import { Sprite } from "pixi.js";
import { useEffect, useMemo } from "react";
import { TextureMaskProps } from "./texture-mask.d";

export default function TextureMask({ texture, children }: TextureMaskProps) {
    const mask = useMemo(() => new Sprite(texture), [texture]);

    useEffect(() => () => { mask.destroy(true); }, []);

    return <Container mask={mask}>{children}</Container>;
}