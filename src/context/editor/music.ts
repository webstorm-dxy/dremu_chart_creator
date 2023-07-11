import { createContext } from "react";
import { HTMLMediaControls, HTMLMediaProps, HTMLMediaState } from "react-use/lib/factory/createHTMLMediaHook";

export type IMusicContext = {
    props: HTMLMediaProps;
    state: HTMLMediaState;
    controls: HTMLMediaControls;
};

export const defaultMusicContext: IMusicContext = {
    props: {src: ''},
    state: null,
    controls: null,
};

export const MusicContext = createContext(defaultMusicContext);