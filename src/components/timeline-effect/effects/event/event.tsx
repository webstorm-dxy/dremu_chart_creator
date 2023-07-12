import { useSize } from 'ahooks';
import { ReactNode, useRef } from 'react';
import styles from './event.module.scss';

import useClassName from "@/hooks/use-class-name";

export type IEventProps = {
    children: (width: number, height: number) => ReactNode;
    className?: string;
};

export default function EventEffect({children, className}: IEventProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const { width = 0, height = 0 } = useSize(containerRef) || {};

    return <div ref={containerRef} className={useClassName(styles['event-effect-container'], className)}>
        {children(width, height)}
    </div>;
}