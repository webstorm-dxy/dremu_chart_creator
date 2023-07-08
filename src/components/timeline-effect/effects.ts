import { ReactNode } from "react";
import { TimelineAction, TimelineRow } from "@xzdarcy/react-timeline-editor";
import AudioEffect from "./effects/audio";

const timelineEffects: Record<string, (action: TimelineAction, row: TimelineRow) => ReactNode> = {
    audio: AudioEffect,
    // 'note-tap': () => <></>
};

export default timelineEffects;