import type { Graphics as PGraphics } from 'pixi.js';
import { Container, Graphics, Sprite } from '@pixi/react';
import {BackgroundProps} from './background.d';
import { useCallback } from 'react';
import React from 'react';




export default function Background(props: BackgroundProps) {
    const {texture, width, height, mask, zIndex} = props;
    
    const drawMask = useCallback((g: PGraphics) => {
        g.beginFill(0x000000, 0.6);
        g.drawRect(0, 0, width, height);
        g.endFill();
    }, []);

    return <Container zIndex={zIndex}>
            <Sprite texture={texture} width={width} height={height}></Sprite>
            {mask && <Graphics draw={drawMask}></Graphics>}
        </Container>;
}