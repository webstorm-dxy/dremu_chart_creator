// import { Ticker } from "pixi.js";
import {Container} from '@inlet/react-pixi';
// import { Graphics, MaskData } from 'pixi.js';
import {SceneProps} from './scene.d';

// function getMask(width: number, height: number) {
//     const g = new Graphics();
//     g.beginFill(0xffffff);
//     g.drawRect(0, 0, width, height);
//     g.endFill();
//     // return new MaskData(g);
// }

export default function Scene(props: SceneProps) {
    return <Container {...props} /* mask={getMask(props.width, props.height)} */></Container>;
}