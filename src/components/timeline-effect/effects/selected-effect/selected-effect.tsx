import useClassName from '@/hooks/use-class-name';
import styles from './selected-effect.module.scss';

import { PropsWithChildren } from "react";
import { TimelineAction, TimelineRow } from '@xzdarcy/react-timeline-editor';

export type ISelectedEffectProps = PropsWithChildren<{
    action: TimelineAction;
    row: TimelineRow;
}>;

export default function SelectedEffect({action, row, children}: ISelectedEffectProps) {
    
    return <div className={useClassName("h-full w-full", action.start === action.end ? styles['drop-shadow'] : styles['box-shadow'])}>{children}</div>;
}