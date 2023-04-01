import { Graphics } from "pixi.js";
import { useEffect, useMemo } from "react";

export default function useMask(draw: (graphics: Graphics) => void): Graphics {
    const mask = useMemo(() => new Graphics(), []);

    useEffect(() => {
        mask.clear();

        draw(mask);
    }, [draw]);

    useEffect(() => () => { mask.destroy(true); });

    return mask;
}