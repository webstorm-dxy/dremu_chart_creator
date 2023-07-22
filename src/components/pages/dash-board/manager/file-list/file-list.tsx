import styles from './file-list.module.scss';

import { List } from 'antd';
import { usePartial } from '@/hooks/use-partial';
import { ReactNode, useMemo } from 'react';
import Icon from '@/components/icon/icon';
import { FileEntry } from '@tauri-apps/api/fs';
import { RecentChart } from '@/scripts/utils/fs/recent-chart';
import { clone } from 'lodash';

interface FileListProps {
    showFiles: FileEntry[];
    openDir?: Function;
    path?: string[];
    sort?: (a: RecentChart, b: RecentChart) => number;
    actions?: (item: FileEntry, index: number) => ReactNode[];
}

export default function FileList({ showFiles, openDir, path, sort, actions }: FileListProps) {
    [openDir, path, sort] = usePartial([openDir, path, sort], [() => { }, [], () => 0]);

    const showData = useMemo(() => {
        const res = clone(showFiles.sort(sort));
        if (path.length) res.unshift({ path: path.slice(0, -1).join('/'), name: '../', children: [] });
        return res;
    }, [sort, path, showFiles]);

    return <List className={styles['file-list']}
        size='small'
        split={false}
        dataSource={showData}
        renderItem={(item, index) => <List.Item
            className='hover:bg-gray-50 transition-colors rounded'
            actions={actions?.(item, index).filter(v => v)}>
            <List.Item.Meta key={index} title={<div onClick={() => { if (item.children) openDir(item.name); }}>{item.name}</div>} avatar={<Icon icon={item.children ? 'folder' : 'file-lines'} />}/>
        </List.Item>}>
    </List>;
}
