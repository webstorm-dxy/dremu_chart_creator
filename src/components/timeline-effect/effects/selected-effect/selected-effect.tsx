import useClassName from '@/hooks/use-class-name';
import styles from './selected-effect.module.scss';

import { PropsWithChildren } from "react";

export default function SelectedEffect(props: PropsWithChildren) {
    
    
    return <div className={useClassName("h-full w-full", styles.shadow)}>{props.children}</div>;
}