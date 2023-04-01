import styles from '@styles/Editor.module.scss';

import Head from "next/head";
import Header from '@components/pages/editor/header/header';
import Main from '@components/pages/editor/main/main';
import { Context, createContext, useEffect, useState } from 'react';
import FCState from '@interfaces/function-component-state';
import { EditorConfigs, EditorContext } from '@interfaces/pages/editor.d';
import { BaseDirectory, exists, readTextFile } from '@tauri-apps/api/fs';
import { Modal, Spin } from 'antd';
import ChartData, { parseAecChart } from '@scripts/chart-data/chart-data';



export const editorContext: Context<EditorContext> = createContext({
    editorConfigs: {path: ''},
    chart: undefined,
    musicUrl: '',
    setEditorConfigs() { },
    setChart() { },
    setMusicUrl() { },
});

export default function Editor() {
    const [editorConfigs, setEditorConfigs]: FCState<EditorConfigs> = useState({path: ''});
    const [chart, setChart]:FCState<ChartData> = useState();
    const [musicUrl, setMusicUrl]:FCState<string> = useState('');

    useEffect(() => {
        const paramArr = window.location.search.replace('?', '').split(',');
        const params: Partial<EditorConfigs> = {};

        function noChart() {
            Modal.error({
                title: '错误',
                okText: '返回',
                onOk() {
                    open('/', '_self');
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
        exists(path, { dir: BaseDirectory.Resource }).catch(noChart).then(async (v) => {
            if (!v) { noChart(); return; }

            const aecChart = await readTextFile(path, { dir: BaseDirectory.Resource }).then(v => JSON.parse(v));
            // const {chart, music} = await parseAecChart(aecChart);
            // const musicUrl = URL.createObjectURL(music);
            // open(musicUrl, '_blank');
            // setChart(chart);
            // setMusicUrl(musicUrl);
        });
    }, []);

    return (
        <editorContext.Provider value={{ editorConfigs, chart, musicUrl, setEditorConfigs, setChart, setMusicUrl}}>
            <Head>
                <title>Re: AstEdit - Chart Editor for Astaeus - Vestar Team</title>
                <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
            </Head>
            <div className={styles.main}>
                {!chart && <div className={styles["spin-container"]}>
                    <Spin className={styles.spin} size='large' tip="loading..." />
                </div>}
                <Header></Header>
                <Main></Main>
            </div>
        </editorContext.Provider>
    );
}

function readTextFiles() {
    throw new Error('Function not implemented.');
}
