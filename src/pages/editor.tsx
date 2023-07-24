import styles from '@styles/Editor.module.scss';

import Head from "next/head";
import Main from '@components/pages/editor/main/main';
import { BaseDirectory, createDir, exists, readTextFile } from '@tauri-apps/api/fs';
import { Modal, Spin } from 'antd';
import { parseAecChart } from '@scripts/chart-data/chart-data';
import turnTo, { Pages } from '@/scripts/manager/page';
import { SetStateContextType, useSetStateContextValue, useStateContext } from '@/hooks/use-state-context';
import { EditorConfigs, defaultEditorContext, EditorContext } from '@/context/editor/editor';
import { setRecordState } from '@/hooks/set-record-state';
import { useAudio } from 'react-use';
import { MusicContext } from '@/context/editor/music';
import { HTMLMediaProps } from 'react-use/lib/factory/createHTMLMediaHook';
import { getAudio } from '@/scripts/utils/fs/audio';
import { useInterval, useKeyPress, useMount } from 'ahooks';
import { useEffect, useMemo } from 'react';
import { UserConfigContext } from '@/context/user-config';
import { throttle } from 'lodash';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('@components/pages/editor/header/header'), {ssr: false});

export default function Editor() {
    const [userConfigContext,] = useStateContext(UserConfigContext);
    const editorContextValue = useSetStateContextValue(defaultEditorContext, { type: SetStateContextType.Set });
    const [music, musicState, musicControls, musicRef] = useAudio(editorContextValue.state.musicProps);
    const musicContextValue = useMemo(() => {
        return {
            props: music.props as HTMLMediaProps,
            state: musicState,
            controls: musicControls,
            ref: musicRef
        };
    }, [music.props, musicState, musicRef]);

    useMount(() => {
        const paramArr = window.location.search.slice(1).split(',');
        const params: Partial<EditorConfigs> = {};

        function noChart() {
            Modal.error({
                title: '错误',
                okText: '返回',
                onOk() {
                    turnTo(Pages.DASH_BOARD);
                },
                content: '未获取到谱面',
            });
        }

        // noChart();

        paramArr.forEach((v) => {
            const k = v.slice(0, v.indexOf('='));
            const value = v.slice(v.indexOf('=') + 1, v.length);

            params[k] = value;
        });

        const path = decodeURI(params.path);

        if (!path) {
            noChart();
        }

        setRecordState(editorContextValue.setAction, prev => prev.editorConfigs.path = path);

        exists(path, { dir: BaseDirectory.Resource }).catch(noChart).then(async (v) => {
            if (!v) { noChart(); return; }

            const aecChart = await readTextFile(path, { dir: BaseDirectory.Resource }).then(v => JSON.parse(v));
            const chart = await parseAecChart(aecChart);
            setRecordState(editorContextValue.setAction, prev => prev.chart = chart);

            const musicContent = await getAudio(chart.getId());
            const music = new Blob([musicContent], { type: 'audio/ogg' });

            const musicUrl = URL.createObjectURL(music);

            setRecordState(editorContextValue.setAction, prev => prev.musicProps = { src: musicUrl, id: 'music', preload: 'auto' });
        });
    });

    useEffect(() => {
        editorContextValue.state.chart?.meta.bpm.setMusicLength(musicState.duration);
    }, [musicState.duration]);

    const saveChart = throttle(async() => {
        await createDir('backup-copy', {dir: BaseDirectory.Resource}).catch(() => {});
        editorContextValue.state.chart.saveAec('backup-copy/' + editorContextValue.state.chart.getId());
    }, 3000);

    useInterval(saveChart, userConfigContext.editor.autoSaveDelay || 60000);

    useKeyPress('space', throttle(() => {
        musicState.paused ? musicControls.play() : musicControls.pause();
    }, 100), {exactMatch: true});

    useKeyPress('ctrl.s', saveChart, {exactMatch: true});

    return (
        <EditorContext.Provider value={editorContextValue}>
            <MusicContext.Provider value={musicContextValue}>
                <Head>
                    <title>Re: AstEdit - Chart Editor for Astaeus - Vestar Team</title>
                    <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
                </Head>
                <div className={styles.main}>
                    {!editorContextValue.state.chart && <div className={styles["spin-container"]}>
                        <Spin className={styles.spin} size='large' tip="loading..." />
                    </div>}
                    <Header/>
                    <Main/>
                </div>
                {music}
            </MusicContext.Provider>
        </EditorContext.Provider>
    );
}
