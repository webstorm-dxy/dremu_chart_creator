import { createStateContext } from "@/hooks/use-state-context";
import { ITimelineEffects } from "@/interfaces/timeline";
import ChartData from "@/scripts/chart-data/chart-data";
import TimelineTicker from "@/scripts/timeline/ticker";
import { TimelineRow } from "@xzdarcy/react-timeline-editor";
import { HTMLMediaProps } from "react-use/lib/factory/createHTMLMediaHook";
import { defaultMusicContext } from "./music";

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
    musicProps: HTMLMediaProps;
    editing: {
        line: Int|null;
    },
    timeline: {
        data: TimelineRow[];
        effects: ITimelineEffects;
        engine: TimelineTicker;
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
    musicProps: defaultMusicContext.props,
    editing: {line: null},
    timeline: {
        data: [],
        effects: {},
        engine: new TimelineTicker(),
        beatBar: 4,
        scaleWidth: 160,
    }
};

export const EditorContext = createStateContext(defaultEditorContext);