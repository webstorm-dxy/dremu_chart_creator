import { UserConfigContext } from "@/context/user-config";
import { useStateContext } from "@/hooks/use-state-context";
import { Timeline, TimelineState } from "@xzdarcy/react-timeline-editor";
import { throttle } from "lodash";
import { useEffect, useRef } from "react";

export default function TimelineEditor() {
    const [userConfigContext,] = useStateContext(UserConfigContext);
    const timelineRef = useRef<TimelineState>(null);

    useEffect(() => {
        const tLine = timelineRef.current;
        if (tLine) {
            const timeArea = tLine.target.firstChild;

            const wheelEvent = throttle((ev: WheelEvent) => {
                const offset = (ev.deltaY > 0 ? 0.5 : -0.5)
                    * (ev.altKey ? 2 : 1) // 转为方向
                    * (userConfigContext.editor.wheelInversion ? -1 : 1) // 反转方向
                    * (ev.shiftKey ? 2 : 1); // 加速
                if (!ev.altKey) {
                    const time = Math.max(tLine.getTime() + offset, 0);
                    tLine.setTime(time);
                    tLine.setScrollLeft(Math.max(0, (time * 160 - 40)));
                }
            }, 100);

            timeArea.addEventListener('wheel', wheelEvent);

            return () => {
                timeArea.removeEventListener('wheel', wheelEvent);
            };
        }
    }, [timelineRef.current]);

    return <Timeline
        style={{ width: '100%', height: 240 }}
        ref={timelineRef}
        editorData={[]}
        effects={{}}
        scale={1}
        scaleWidth={160}
        scaleSplitCount={4}
        minScaleCount={40}
    />;
}