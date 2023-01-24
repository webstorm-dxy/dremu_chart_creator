import type { Graphics as PGraphics } from 'pixi.js';
import { Container, Graphics, Sprite } from '@inlet/react-pixi';
import {BackgroundProps} from './background.d';
import { useCallback } from 'react';




export default function Background(props: BackgroundProps) {
    const {texture, viewWidth, viewHeight, mask, zIndex} = props;
    
    const drawMask = useCallback((g: PGraphics) => {
        g.beginFill(0x000000, 0.6);
        g.drawRect(0, 0, viewWidth, viewHeight);
        g.endFill();
    }, []);

    return <Container zIndex={zIndex}>
            <Sprite texture={texture} width={viewWidth} height={viewHeight}></Sprite>
            {mask && <Graphics draw={drawMask}></Graphics>}
        </Container>;
}