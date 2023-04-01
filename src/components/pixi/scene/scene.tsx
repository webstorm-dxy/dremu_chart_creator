import { Container } from '@pixi/react';
import { useCallback } from 'react';
import {GraphicsMask} from '../mask/mask';
import { SceneProps } from './scene.d';

export default function Scene(props: SceneProps) {
    const { viewWidth, viewHeight } = props;

    const maskDraw = useCallback((g) => {
        g.beginFill(0xffffff)
            .drawRect(0, 0, viewWidth, viewHeight)
            .endFill();
    }, [viewWidth, viewHeight]);

    return <GraphicsMask draw={maskDraw}>
        <Container {...props}></Container>
    </GraphicsMask>;

    // return <Container {...props}></Container>;
}