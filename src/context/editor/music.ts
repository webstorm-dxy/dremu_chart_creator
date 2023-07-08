import { createStateContext } from "@/hooks/use-state-context";
import { HTMLMediaProps } from "react-use/lib/factory/createHTMLMediaHook";

export type IMusicContext = HTMLMediaProps;

export const defaultMusicContext: IMusicContext = {src: ''};

export const MusicContext = createStateContext(defaultMusicContext);