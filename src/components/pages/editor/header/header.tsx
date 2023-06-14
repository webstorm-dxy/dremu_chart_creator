import { editorContext } from '@/pages/editor';
import styles from './header.module.scss';

import Icon from '@/components/icon/icon';
import turnTo, { Pages } from '@/scripts/manager/page';
import { Menu, MenuProps } from 'antd';
import { useContext, useMemo } from 'react';
import useClassName from '@/hooks/use-class-name';

export default function Header() {
    const { editorConfigs: { path } } = useContext(editorContext);

    const items = useMemo<MenuProps['items']>(() => [
        {
            key: 'back-file-manager',
            onClick: () => turnTo(Pages.FILE_MANAGER),
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