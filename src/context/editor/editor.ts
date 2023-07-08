import { createStateContext } from "@/hooks/use-state-context";
import { ITimelineEffects } from "@/interfaces/timeline";
import ChartData from "@/scripts/chart-data/chart-data";
import TimelineTicker from "@/scripts/timeline/ticker";
import { TimelineEngine, TimelineRow } from "@xzdarcy/react-timeline-editor";

export interface EditorConfigs {
    path: string;
    snip: {
        gird: boolean;
        dragline: boolean;
    };
    preview: {
        paused: boolean;
        scale: number;
    }
}

export interface IEditorContext {
    editorConfigs: EditorConfigs;
    chart: ChartData | null;
    musicUrl: string;
    timeline: {
        data: TimelineRow[];
        effects: ITimelineEffects;
        engine: TimelineEngine;
        beatBar: number;
        scaleWidth: number;
    }
}

export const defaultEditorContext: IEditorContext = {
    editorConfigs: {
        path: '',
        snip: {
            gird: true,
            dragline: true
        },
        preview: {
            paused: true,
            scale: 1
        }
    },
    chart: null,
    musicUrl: '',
    timeline: {
        data: [{id: 'music', actions: [{id: 'music', start: 0, end: 120, effectId: 'audio', movable: false, flexible: false}]}],
        effects: {},
        engine: new TimelineTicker(),
        beatBar: 4,
        scaleWidth: 160,
    }
};

export const EditorContext = createStateContext(defaultEditorContext);