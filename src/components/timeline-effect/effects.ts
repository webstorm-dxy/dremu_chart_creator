import { ReactNode } from "react";
import { TimelineAction, TimelineRow } from "@xzdarcy/react-timeline-editor";
import AudioEffect from "./effects/audio";
import { NoteDarg, NoteFlick, NoteTap } from "./effects/note";
import { Dot } from "./effects/dot";
import { Timing } from "./effects/timing";

export const timelineEffectRenders: Record<string, (action: TimelineAction, row: TimelineRow, props?: Record<string, unknown>) => ReactNode> = {
    audio: AudioEffect,
    'note-0': NoteTap,
    'note-2': NoteDarg,
    'note-3': NoteFlick,
    dot: Dot,
    timing: Timing,
};

export const timelineEffects = {}; 