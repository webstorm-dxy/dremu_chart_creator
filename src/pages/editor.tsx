import styles from '@styles/Editor.module.scss';

import Head from "next/head";
import Header from '@components/pages/editor/header/header';
import Main from '@components/pages/editor/main/main';
import { BaseDirectory, exists, readTextFile } from '@tauri-apps/api/fs';
import { Modal, Spin } from 'antd';
import { parseAecChart } from '@scripts/chart-data/chart-data';
import turnTo, { Pages } from '@/scripts/manager/page';
import { SetStateContextType, useSetStateContextValue } from '@/hooks/use-state-context';
import { EditorConfigs, defaultEditorContext, EditorContext } from '@/context/editor/editor';
import { setRecordState } from '@/hooks/set-record-state';
import { useAudio } from 'react-use';
import { MusicContext } from '@/context/editor/music';
import { HTMLMediaProps } from 'react-use/lib/factory/createHTMLMediaHook';
import { getAudio } from '@/scripts/utils/fs/audio';
import { useMount } from 'ahooks';
import { useEffect } from 'react';

export default function Editor() {
    const editorContextValue = useSetStateContextValue(defaultEditorContext, { type: SetStateContextType.Set });
    const [music, musicState, musicControls] = useAudio(editorContextValue.state.musicProps);
    const musicContextValue = {props: music.props as HTMLMediaProps, state: musicState, controls: musicControls};

    useMount(() => {
        const paramArr = window.location.search.slice(1).split(',');
        const params: Partial<EditorConfigs> = {};

        function noChart() {
            Modal.error({
                title: '错误',
                okText: '返回',
                onOk() {
                    turnTo(Pages.FILE_MANAGER);
                },
                content: '未获取到谱面',
            });
        }

        paramArr.forEach((v) => {
            const k = v.slice(0, v.indexOf('='));
            const value = v.slice(v.indexOf('=') + 1, v.length);

            params[k] = value;
        });

        const { path } = params;

        if (!path) {
            noChart();
        }

        setRecordState(editorContextValue.setAction, prev => prev.editorConfigs.path = path);

        exists(path, { dir: BaseDirectory.Resource }).catch(noChart).then(async (v) => {
            if (!v) { noChart(); return; }

            const aecChart = await readTextFile(path, { dir: BaseDirectory.Resource }).then(v => JSON.parse(v));
            const chart = await parseAecChart(aecChart);
            setRecordState(editorContextValue.setAction, prev => prev.chart = chart);
            
            const music = new Blob([await getAudio(chart.getId())], {type: 'audio/ogg'});

            const musicUrl = URL.createObjectURL(music);

            setRecordState(editorContextValue.setAction, prev => prev.musicProps = {src: musicUrl, id: 'music'});
        });
    });

    useEffect(() => {
        editorContextValue.state.chart?.meta.bpm.setMusicLength(musicState.duration);
    }, [musicState.duration]);

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
                    <Header></Header>
                    <Main></Main>
                </div>
                {music}
            </MusicContext.Provider>
        </EditorContext.Provider>
    );
}
