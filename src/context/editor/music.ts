import { MutableRefObject, createContext } from "react";
import { HTMLMediaControls, HTMLMediaProps, HTMLMediaState } from "react-use/lib/factory/createHTMLMediaHook";

export type IMusicContext = {
    props: HTMLMediaProps;
    state: HTMLMediaState;
    controls: HTMLMediaControls;
    ref: MutableRefObject<HTMLAudioElement>|null;
};

export const defaultMusicContext: IMusicContext = {
    props: {src: ''},
    state: null,
    controls: null,
    ref: null
};

export const MusicContext = createContext(defaultMusicContext);