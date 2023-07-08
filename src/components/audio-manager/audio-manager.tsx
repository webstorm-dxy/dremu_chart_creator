import { setRecordState } from '@/hooks/set-record-state';
import { createStateContext, useSetStateContextValue, useStateContext } from '@/hooks/use-state-context';
import { useMount } from 'ahooks';
import { PropsWithChildren, useEffect } from 'react';
import { useAudio } from 'react-use';
import { HTMLMediaControls, HTMLMediaProps, HTMLMediaState } from 'react-use/lib/factory/createHTMLMediaHook';

export type IAudioManagerContext = Record<string | number | symbol, {
    props: HTMLMediaProps;
    state?: HTMLMediaState;
    controls?: HTMLMediaControls;
}>;

export const defaultAudioManagerContext: IAudioManagerContext = {};

export const AudioManagerContext = createStateContext<IAudioManagerContext>(defaultAudioManagerContext);


export type IAudioManagerProps = PropsWithChildren<{
    audios: Record<string | number | symbol, { props: HTMLMediaProps }>;
}>

function Audio(props: HTMLMediaProps & { id: string | number | symbol }) {
    const [, setAudios] = useStateContext(AudioManagerContext);
    const [audio, state, controls] = useAudio(props);

    useMount(() => {
        setRecordState(setAudios, prev => {
            prev[props.id].controls = controls;
        });
    });

    useEffect(() => {
        setRecordState(setAudios, prev => {
            prev[props.id].state = state;
        });
    }, [state]);
    
    return audio;
}

export default function AudioManager(props: IAudioManagerProps) {
    const audioManagerContextValue = useSetStateContextValue(props.audios || defaultAudioManagerContext);
    const audios = audioManagerContextValue.state;

    return <AudioManagerContext.Provider value={audioManagerContextValue}>
        {props.children}
        {Object.keys(audios).map(key => <Audio key={key} id={key} {...audios[key].props} />)}
    </AudioManagerContext.Provider>;
}