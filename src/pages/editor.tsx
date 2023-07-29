import styles from '@styles/Editor.module.scss';

import Head from "next/head";
import Main from '@components/pages/editor/main/main';
import { BaseDirectory, createDir, exists, readTextFile } from '@tauri-apps/api/fs';
import { Modal, Spin, message, notification } from 'antd';
import ChartData, { parseAecChart } from '@scripts/chart-data/chart-data';
import turnTo, { Pages } from '@/scripts/manager/page';
import { SetStateContextType, useSetStateContextValue, useStateContext } from '@/hooks/use-state-context';
import { EditorConfigs, defaultEditorContext, EditorContext } from '@/context/editor/editor';
import { setRecordState } from '@/hooks/set-record-state';
import { useAudio } from 'react-use';
import { MusicContext } from '@/context/editor/music';
import { HTMLMediaProps } from 'react-use/lib/factory/createHTMLMediaHook';
import { getAudio } from '@/scripts/utils/fs/audio';
import { useInterval, useMount } from 'ahooks';
import { useMemo } from 'react';
import { UserConfigContext } from '@/context/user-config';
import { debounce, throttle } from 'lodash';
import dynamic from 'next/dynamic';
import useHotkey from '@/hooks/use-hotkey';

const Header = dynamic(() => import('@components/pages/editor/header/header'), { ssr: false });

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

        function noChart(msg: string|Error = '未获取到谱面') {
            msg = msg instanceof Error ? msg.message : typeof msg === 'string' ? msg : `Unknown returned: ${msg}`;
            Modal.error({
                title: '错误',
                okText: '返回',
                onOk() {
                    turnTo(Pages.DASH_BOARD);
                },
                content: msg,
            });
        }

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
            if (!(chart instanceof ChartData)) {
                noChart(chart);
                return;
            }
            setRecordState(editorContextValue.setAction, prev => prev.chart = chart);

            const musicContent = await getAudio(chart.getId());
            const music = new Blob([musicContent], { type: 'audio/ogg' });

            const musicUrl = URL.createObjectURL(music);

            setRecordState(editorContextValue.setAction, prev => prev.musicProps = { src: musicUrl, id: 'music', preload: 'auto' });
        });
    });

    const saveChart = throttle(async (targetDir: string) => {
        await createDir(targetDir, { dir: BaseDirectory.Resource }).catch(() => { });
        editorContextValue.state.chart.saveAec(targetDir + '/' + editorContextValue.state.chart.getId())
            .then(() => message.success(targetDir === 'backup-copy' ? '备份保存成功' : '保存成功'))
            .catch((err) => notification.error({ message: '保存失败', description: '错误信息:\n' + err, duration: null }));
    }, 3000);

    useInterval(() => saveChart('backup-copy'), userConfigContext.editor.autoSaveDelay || 60000);

    useHotkey('toggleMusicPlay', throttle(() => {
        musicState.paused ? musicControls.play() : musicControls.pause();
    }, 100));

    useHotkey('saveChart', debounce(() => saveChart('chart'), 200));

    return (
        <EditorContext.Provider value={editorContextValue}>
            <MusicContext.Provider value={musicContextValue}>
                <Head>
                    <title>Re: AstEdit - Chart Editor for Astaeus - Vestar Team</title>
                    <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
                </Head>
                <div className={styles.main}>
                    {!editorContextValue.state.chart && <div className={styles["spin-container"]}>
                        <Spin className={styles.spin} size='large' tip="loading..."/>
                    </div>}
                    <Header />
                    <Main />
                </div>
                {music}
            </MusicContext.Provider>
        </EditorContext.Provider>
    );
}
