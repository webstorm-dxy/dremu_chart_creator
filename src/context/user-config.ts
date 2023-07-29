import { createStateContext } from "@/hooks/use-state-context";
import { ISetKeySoundAttrs } from "@/scripts/timeline/key-sound";
import { KeyFilter } from "ahooks/lib/useKeyPress";

export interface IUserConfigContext {
    editor: {
        autoSaveDelay: number;
        wheelInversion: boolean;
        keySound: Record<'tap' | 'hold' | 'darg' | 'flick' & string, ISetKeySoundAttrs | null>;

    };
    hotkeys: Record<keyof {
        toggleMusicPlay;
        saveChart;
        lastLine;
        nextLine;
        addNoteTypeTap;
        addNoteTypeDarg;
        addNoteTypeFlick;
        addNoteTypeHold;
        previewFromStart;
        previewFromNow;
        resetPlayRate;
        addPlayRate;
        subPlayRate;
        glueEvent;
        cut;
        delete;
        copy;
        paste;
        clearSelected;
    }, KeyFilter>;
}

export const defaultUserConfigContext: IUserConfigContext = {
    editor: {
        autoSaveDelay: 60000,
        wheelInversion: false,
        keySound: {
            tap: { src: '/audio/key-sound/0.wav' },
            hold: { src: '/audio/key-sound/1.wav' },
            darg: { src: '/audio/key-sound/2.wav' },
            flick: { src: '/audio/key-sound/3.wav' },
        }
    },
    hotkeys: {
        toggleMusicPlay: 'space',
        saveChart: 'ctrl.s',
        lastLine: 'dash',
        nextLine: 'equalsign',
        addNoteTypeTap: 'q',
        addNoteTypeDarg: 'w',
        addNoteTypeFlick: 'e',
        addNoteTypeHold: 'r',
        previewFromStart: 'ctrl.shift.p',
        previewFromNow: 'ctrl.p',
        resetPlayRate: '1',
        addPlayRate: 'openbracket',
        subPlayRate: 'closebracket',
        glueEvent: 'ctrl.g',
        cut: 'ctrl.x',
        delete: 'delete',
        copy: 'ctrl.c',
        paste: 'ctrl.v',
        clearSelected: 'ctrl.d',
    }
};

export const UserConfigContext = createStateContext<IUserConfigContext>(defaultUserConfigContext);