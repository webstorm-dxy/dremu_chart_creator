import { createStateContext } from "@/hooks/use-state-context";
import { ISetKeySoundAttrs } from "@/scripts/timeline/key-sound";

export interface IUserConfigContext {
    editor: {
        autoSaveDelay: number;
        wheelInversion: boolean;
        keySound: Record<'tap'|'hold'|'darg'|'flick' & string, ISetKeySoundAttrs|null>;
    }
}

export const defaultUserConfigContext: IUserConfigContext = {
    editor: {
        autoSaveDelay: 60000,
        wheelInversion: false,
        keySound: {
            tap: {src: '/audio/key-sound/0.wav'},
            hold: {src: '/audio/key-sound/1.wav'},
            darg: {src: '/audio/key-sound/2.wav'},
            flick: {src: '/audio/key-sound/3.wav'},
        }
    }
};

export const UserConfigContext = createStateContext<IUserConfigContext>(defaultUserConfigContext);