import { ReactNode } from "react";
import { TimelineAction, TimelineRow } from "@xzdarcy/react-timeline-editor";
import AudioEffect from "./effects/audio";
import { NoteDarg, NoteFlick, NoteTap } from "./effects/note";

const timelineEffects: Record<string, (action: TimelineAction, row: TimelineRow) => ReactNode> = {
    audio: AudioEffect,
    'note-0': NoteTap,
    'note-2': NoteDarg,
    'note-3': NoteFlick
};

export default timelineEffects;