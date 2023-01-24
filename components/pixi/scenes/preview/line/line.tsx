import { Container, Graphics } from "@inlet/react-pixi";
import { MaskData, Graphics as PGraphics } from "pixi.js";
import { useCallback } from "react";

const mg/* maskGraphics */ = new PGraphics();
mg.drawRect(-9000, -9000, 18000, 9000);
// const lineMask = new MaskData(mg);

export default function Line(props) {
    const draw = useCallback((g) => {
        
    }, [props]);
    
    return <Graphics draw={draw} /* mask={lineMask} *//>;
}