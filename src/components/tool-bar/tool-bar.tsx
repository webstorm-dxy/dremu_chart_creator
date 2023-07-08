import { UserConfigContext } from '@/context/user-config';

import useClassName from "@/hooks/use-class-name";
import { useStateContext } from '@/hooks/use-state-context';
import { PropsWithChildren, WheelEvent, useCallback, useMemo, useRef, useState } from "react";
import { Space } from 'antd';

export type IToolBarProps = PropsWithChildren<{
    className?: string;
}>;

export default function ToolBar(props: IToolBarProps) {
    const [userConfigContext,] = useStateContext(UserConfigContext);
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [offset, setOffsetAction] = useState<number>(0);

    const containerWidth = containerRef.current?.clientWidth || 0;
    const contentWidth = contentRef.current?.clientWidth || 0;
    const max = useMemo(() => Math.max(0, contentWidth - containerWidth), [containerWidth, contentWidth]);

    const setOffset = useCallback((newOffset: number|((prevOffset: number) => number)) => {
        setOffsetAction(prev => Math.min(Math.max(newOffset instanceof Function ? newOffset(prev) : newOffset, 0), max));
    }, [max]);

    const onWheelHandler = (ev: WheelEvent<HTMLDivElement>) => {
        const delta = ev.deltaY * (userConfigContext.editor.wheelInversion ? -1 : 1);
        setOffset(prev => prev + delta);
    };

    return <div ref={containerRef} className={useClassName('h-8 w-full bg-white overflow-hidden relative', props.className)} onWheel={onWheelHandler}>
        <Space ref={contentRef} style={{marginLeft: `-${offset}px`}} className="h-full w-fit">{props.children}</Space>
    </div>;
}