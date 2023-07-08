import { TimelineAction, TimelineRow } from "@xzdarcy/react-timeline-editor";
import { HTMLAttributes, ReactNode, useMemo } from "react";

export interface ITimelineEffectProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    action: TimelineAction;
    row: TimelineRow;
    children?: ReactNode | ((ev: { action: TimelineAction, row: TimelineRow }) => ReactNode);
}

export default function TimelineEffect(props: ITimelineEffectProps) {
    const children = useMemo(() => {
        const { children, action, row } = props;
        return children instanceof Function ? children({ action, row }) : children;
    }, [props.children]);

    return <div {...props}>{children}</div>;
}

export function createTimelineEffect(children?: ITimelineEffectProps['children']) {
    // eslint-disable-next-line react/display-name
    return (action: TimelineAction, row: TimelineRow) => <TimelineEffect action={action} row={row}>{children}</TimelineEffect>;
}