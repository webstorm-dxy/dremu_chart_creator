import styles from './header.module.scss';

import Icon from '@/components/icon/icon';
import turnTo, { Pages } from '@/scripts/manager/page';
import { Menu, MenuProps, Modal, message } from 'antd';
import { useMemo } from 'react';
import useClassName from '@/hooks/use-class-name';
import { useStateContext } from '@/hooks/use-state-context';
import { EditorContext } from '@/context/editor/editor';
import { connectPreview, disconnectPreview } from '@/scripts/manager/preview';

export default function Header() {
    const [{ editorConfigs: { path }, chart },] = useStateContext(EditorContext);

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
                        turnTo(Pages.FILE_MANAGER);
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
                    onClick: () => chart ? chart.saveJson(`json-chart/${path.slice(path.lastIndexOf('/') + 1, path.lastIndexOf('.aec'))}.json`) : message.warning('数据加载中，请稍后重试')
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
                    key: '',
                    label: '',
                }
            ]
        },
        {
            key: 'preview',
            label: '预览',
            children: [
                { key: 'connect-preview', label: '连接预览器', onClick: () => connectPreview()},
                { key: 'disconnect-preview', label: '断开预览器', onClick: () => disconnectPreview()}
            ]
        }
    ], [path, chart]);


    return <Menu className={useClassName(styles.header, 'shadow', 'z-20')} mode='horizontal' items={items} selectable={false}></Menu>;
}