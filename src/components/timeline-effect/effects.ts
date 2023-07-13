import { ReactNode } from "react";
import { TimelineAction, TimelineEffect, TimelineRow } from "@xzdarcy/react-timeline-editor";
import AudioEffect from "./effects/audio";
import { NoteDarg, NoteFlick, NoteTap } from "./effects/note";
import { Dot } from "./effects/dot";
import { Timing } from "./effects/timing";
import { playKeySound } from "@/scripts/timeline/key-sound";

export const timelineEffectRenders: Record<string, (action: TimelineAction, row: TimelineRow, props?: Record<string, unknown>) => ReactNode> = {
    audio: AudioEffect,
    'note-0': NoteTap,
    'note-2': NoteDarg,
    'note-3': NoteFlick,
    dot: Dot,
    timing: Timing,
};

export const timelineEffects: Record<string, TimelineEffect> = {
    'note-0': {
        id: 'note-0',
        source: {
            enter: () => {
                playKeySound('tap');
            }
        }
    },
    'note-1': {
        id: 'note-1',
        source: {
            enter: () => {
                playKeySound('hold');
            }
        }
    },
    'note-2': {
        id: 'note-2',
        source: {
            enter: () => {
                playKeySound('darg');
            }
        }
    },
    'note-3': {
        id: 'note-3',
        source: {
            enter: () => {
                playKeySound('flick');
            }
        }
    },
}; 