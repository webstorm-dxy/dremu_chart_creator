import styles from '@styles/Editor.module.scss';

import Head from "next/head";
import Header from '@components/pages/editor/header/header';
import Main from '@components/pages/editor/main/main';
import { useEffect } from 'react';
import { BaseDirectory, exists, readTextFile } from '@tauri-apps/api/fs';
import { Modal, Spin } from 'antd';
import { parseAecChart } from '@scripts/chart-data/chart-data';
import turnTo, { Pages } from '@/scripts/manager/page';
import { SetStateContextType, useSetStateContextValue } from '@/hooks/use-state-context';
import { EditorConfigs, defaultEditorContext, EditorContext } from '@/context/editor/editor';
import { setRecordState } from '@/hooks/set-record-state';
import AudioManager from '@/components/audio-manager/audio-manager';

export default function Editor() {
    const editorContextValue = useSetStateContextValue(defaultEditorContext, { type: SetStateContextType.Set });
    // const [music, musicContextValue] = useAudioStateContextValue(defaultMusicContext);

    useEffect(() => {
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
        });
    }, []);

    return (
        <EditorContext.Provider value={editorContextValue}>
            <AudioManager audios={{music: {props: {src: ''}}}}>
            {/* <MusicContext.Provider value={musicContextValue}> */}
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
                {/* {music} */}
            {/* </MusicContext.Provider> */}
            </AudioManager>
        </EditorContext.Provider>
    );
}

// function readTextFiles() {
//     throw new Error('Function not implemented.');
// }
