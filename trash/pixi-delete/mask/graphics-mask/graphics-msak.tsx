import { usePartial } from "@/hooks/use-partial";
import { Container, Graphics } from "@pixi/react";
import { Graphics as PGraphics, Point as PPoint } from "pixi.js";
import { useEffect, useMemo } from "react";
import { GraphicsMaskProps } from "./graphics-mask";



export default function GraphicsMask({ draw, show, children, position, rotation, scale }: GraphicsMaskProps) {
    // [position, rotation, scale] = usePartial([position, rotation, scale], [[0, 0], 0, [0, 0]]);
    const mask = useMemo(() => new PGraphics(), []);

    useEffect(() => {
        mask.clear();

        draw(mask);

        mask.toGlobal(new PPoint());
    }, [draw]);

    // useEffect(() => {
    //     mask.position.set(...position);
    // }, [position]);

    // useEffect(() => {
    //     mask.rotation = rotation || 0;
    // }, [rotation]);

    // useEffect(() => {
    //     mask.scale.set(...scale);
    // }, [scale]);

    useEffect(() => () => { mask.destroy(true); }, []);

    // mask.position.set(mask.parent?.position.x || 0, mask.parent?.position.y || 0);

    return <Container mask={mask}>
        {show && <Graphics draw={(g) => { g.clear(); draw(g); }} alpha={0.2} tint={0xff0000}/>}
        {children}
    </Container>;
}