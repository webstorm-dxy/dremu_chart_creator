import { EditorContext } from '@/context/editor/editor';
import { setRecordState } from '@/hooks/set-record-state';
import { createStateContext, useSetStateContextValue, useStateContext } from '@/hooks/use-state-context';
import { getAudio } from '@/scripts/utils/fs/audio';
import { useAsyncEffect, useMount } from 'ahooks';
import { PropsWithChildren, ReactElement, useEffect } from 'react';
import { useAudio } from 'react-use';
import { HTMLMediaControls, HTMLMediaProps, HTMLMediaState } from 'react-use/lib/factory/createHTMLMediaHook';

export type IAudioManagerContext = Record<string | number | symbol, {
    props: HTMLMediaProps & {audio?: ReactElement<HTMLMediaProps>};
    state?: HTMLMediaState;
    controls?: HTMLMediaControls;
}>;

export const defaultAudioManagerContext: IAudioManagerContext = {};

export const AudioManagerContext = createStateContext<IAudioManagerContext>(defaultAudioManagerContext);


export type IAudioManagerProps = PropsWithChildren<{
    audios: Record<string | number | symbol, { props: HTMLMediaProps }>;
}>

function Audio(props: {audioProps: HTMLMediaProps, id: string|number|symbol}) {
    const [, setAudios] = useStateContext(AudioManagerContext);
    const [audio, state, controls] = useAudio(props.audioProps);

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
    const [editorContext,] = useStateContext(EditorContext);
    const audioManagerContextValue = useSetStateContextValue(props.audios || defaultAudioManagerContext);
    const {state: audios, setAction: setAudios} = audioManagerContextValue;

    useAsyncEffect(async() => {
        const chart = editorContext.chart;
        if (chart) {
            const music = new Blob([await getAudio(chart.getId())], {type: 'audio/ogg'});

            const musicUrl = URL.createObjectURL(music);

            setRecordState(setAudios, prev => prev.music.props = {src: musicUrl});
        }
    }, [editorContext.chart]);

    return <AudioManagerContext.Provider value={audioManagerContextValue}>
        {props.children}
        {Object.keys(audios).map(key => <Audio key={key} id={key} audioProps={audios[key].props} />)}
    </AudioManagerContext.Provider>;
}