import styles from './header.module.scss';

import Icon from '@/components/icon/icon';
import turnTo, { Pages } from '@/scripts/manager/page';
import { Menu, MenuProps, Modal } from 'antd';
import { useMemo } from 'react';
import useClassName from '@/hooks/use-class-name';
import { useStateContext } from '@/hooks/use-state-context';
import { EditorContext } from '@/context/editor/editor';

export default function Header() {
    const [{ editorConfigs: { path } },] = useStateContext(EditorContext);

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
                    key: 'save',
                    label: '保存',
                    // onClick: 
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
        }
    ], [path]);

    return <Menu className={useClassName(styles.header, 'shadow', 'z-20')} mode='horizontal' items={items}></Menu>;
}