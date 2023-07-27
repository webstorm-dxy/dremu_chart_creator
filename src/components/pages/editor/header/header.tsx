import styles from './header.module.scss';

import Icon from '@/components/icon/icon';
import turnTo, { Pages } from '@/scripts/manager/page';
import { Menu, MenuProps, Modal, message } from 'antd';
import { useContext, useMemo } from 'react';
import useClassName from '@/hooks/use-class-name';
import { useStateContext } from '@/hooks/use-state-context';
import { EditorContext } from '@/context/editor/editor';
import { connectPreview, disconnectPreview, fetchToPreview } from '@/scripts/manager/preview';
import { BaseDirectory, createDir } from '@tauri-apps/api/fs';
import { resolve as resolvePath, resourceDir } from '@tauri-apps/api/path';
import { MusicContext } from '@/context/editor/music';
import { useKeyPress } from 'ahooks';
import { throttle } from 'lodash';
import { copy, deleteSelected, paste } from '@/scripts/timeline/clip-board';
import { getSelectedData } from '@/scripts/timeline/get-data';
import { setRecordState } from '@/hooks/set-record-state';
import { glueEvent } from '@/scripts/timeline/edit-data';
import { createWindow } from '@/scripts/manager/window-manager';

export default function Header() {
    const [editorContext, setEditorContext] = useStateContext(EditorContext);
    const { editorConfigs: { path }, chart } = editorContext;
    const musicContext = useContext(MusicContext);

    const preview = throttle(async (startTime: number = musicContext?.state?.time || 0) => {
        if (!chart) { message.error('没有谱面'); return; }
        const chartSavePath = `json-chart/${path.slice(path.lastIndexOf('/') + 1, path.lastIndexOf('.aec'))}.json`;
        await createDir('json-chart', { dir: BaseDirectory.Resource }).catch(() => { });
        chart.saveJson(chartSavePath);
        const resourceDirPath = await resourceDir();
        let chartPath = await resolvePath(resourceDirPath, chartSavePath);
        let musicPath = await resolvePath(resourceDirPath, 'audio', chart.getId() + '.ogg');

        if (/^\\\\\?\\.*/.test(chartPath)) chartPath = chartPath.slice(4, chartPath.length);
        if (/^\\\\\?\\.*/.test(musicPath)) musicPath = musicPath.slice(4, musicPath.length);

        fetchToPreview(startTime, chartPath, musicPath);
    }, 500);

    const items = useMemo<MenuProps['items']>(() => [
        {
            key: 'back-file-manager',
            onClick: () => {
                Modal.confirm({
                    type: 'warning',
                    title: "确定离开编辑页面吗",
                    content: '未保存的内容将会丢失！',
                    cancelText: '取消',
                    okText: '确定',
                    onOk: () => {
                        turnTo(Pages.DASH_BOARD);
                    }
                });
            },
            label: <><Icon icon='angle-left'></Icon>返回</>,
            style: { color: 'var(--active-color)' }
        },

        {
            key: 'editing-file',
            disabled: true,
            label: `正在编辑: ` + path.slice(path.lastIndexOf('/') + 1, path.length)
        },

        {
            key: 'file',
            label: '文件',
            children: [
                {
                    key: 'save-chart',
                    label: '保存谱面工程',
                    onClick: () => chart ? chart.saveAec(path) : message.warning('数据加载中，请稍后重试')
                },
                {
                    key: 'save-json-chart',
                    label: '保存谱面文件',
                    onClick: async () => {
                        if (!chart) { message.warning('数据加载中，请稍后重试'); return; }
                        await createDir('json-chart/', { dir: BaseDirectory.Resource }).catch(() => { });
                        chart.saveJson(`json-chart/${path.slice(path.lastIndexOf('/') + 1, path.lastIndexOf('.aec'))}.json`);
                    }
                },
                {
                    key: 'export-chart',
                    label: '导出谱面工程',
                    onClick: () => chart ? chart.downloadAec() : message.warning('数据加载中，请稍后重试')
                },
                {
                    key: 'export-json-chart',
                    label: '导出谱面文件',
                    onClick: () => chart ? chart.downloadJson() : message.warning('数据加载中，请稍后重试')
                }
            ]
        },

        {
            key: 'edit',
            label: '编辑',
            children: [
                {
                    key: 'cut',
                    label: '剪切',
                    disabled: !editorContext?.editing?.selected?.size || false,
                    onClick: () => {
                        copy(setEditorContext, getSelectedData(editorContext));
                        deleteSelected(setEditorContext);
                    }
                },
                {
                    key: 'copy',
                    label: '复制',
                    disabled: !editorContext?.editing?.selected?.size || false,
                    onClick: () => copy(setEditorContext, getSelectedData(editorContext))
                },
                {
                    key: 'paste',
                    label: '粘贴',
                    disabled: !editorContext?.clipBoard?.length || false,
                    onClick: () => paste(
                        setEditorContext,
                        editorContext.timeline.engine.getTime(),
                        editorContext.chart.getLine(editorContext.editing.line)
                    )
                },
                {
                    key: 'delete',
                    label: '删除',
                    disabled: !editorContext?.editing?.selected?.size || false,
                    onClick: () => deleteSelected(setEditorContext)
                },
                {
                    key: 'cancel-selected',
                    label: '取消选择',
                    disabled: !editorContext?.editing?.selected?.size || false,
                    onClick: () => setRecordState(setEditorContext, prev => { 
                        prev?.editing.selected.clear(); 
                        prev.editing.update = {}; 
                    })
                },
                {
                    key: 'glue',
                    label: '粘合',
                    disabled: !editorContext?.editing?.selected?.size || false,
                    onClick: () => editorContext.editing.selected.forEach(val => glueEvent(setEditorContext, val))
                }
            ]
        },
        {
            key: 'preview',
            label: '预览',
            children: [
                { key: 'connect-preview', label: '连接预览器', onClick: () => connectPreview() },
                { key: 'preview-from-start', label: '从头预览', onClick: () => preview(0) },
                { key: 'preview-from-now', label: '从当前位置预览', onClick: () => preview() },
                { key: 'disconnect-preview', label: '断开预览器', onClick: () => disconnectPreview() }
            ]
        },
        {
            key: 'help',
            label: '帮助',
            children: [
                {
                    key: 'doc',
                    label: '文档',
                    onClick: () => createWindow('doc', { url: '/doc' })
                }
            ]
        }
    ], [path, chart, editorContext?.clipBoard, editorContext?.editing?.selected.values()]);

    useKeyPress('ctrl.shift.p', ev => { preview(0); ev.preventDefault(); }, { exactMatch: true });
    useKeyPress('ctrl.p', ev => { preview(); ev.preventDefault(); }, { exactMatch: true });

    return <Menu className={useClassName(styles.header, 'shadow', 'z-20')} mode='horizontal' items={items} selectable={false}></Menu>;
}