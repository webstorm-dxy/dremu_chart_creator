import { TimelineAction, TimelineRow } from "@xzdarcy/react-timeline-editor";
import EventEffect from "./event/event";
import { useStateContext } from "@/hooks/use-state-context";
import { EditorContext } from "@/context/editor/editor";
import { useMemo } from "react";

export const Timing = (action: TimelineAction, row: TimelineRow) => {
    const [editorContext,] = useStateContext(EditorContext);

    const line = useMemo(() => editorContext.chart?.getLine(editorContext.editing.line), [editorContext.editing.line]);

    return <EventEffect>{
        (width, height) => {
            const radius = Math.max(height - 12, 16);
            return <div className="flex items-center justify-center bg-gray-100 rounded-md border-2 border-gray-300 w-fit" style={{ minWidth: radius, height: radius }}>
                {line.timings.find(ev => ev.id === action.id)?.speedRatio}
            </div>;
        }
    }</EventEffect>;
};