import styles from './pixi-app.module.scss';

import { Stage } from "@inlet/react-pixi";
import {PixiAppProps} from './pixi-app.d';
import useClassName from '@hooks/use-class-name';


export default function PixiApp(props: PixiAppProps) {
    const className = useClassName(styles['pixi-app'], props.cls);
    
    return <Stage className={className} {...props}></Stage>;
}