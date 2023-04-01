import styles from './file-option.module.scss';

import Icon from '@components/icon/icon';
import {FileOptionProps} from './file-option.d';
import { MouseEvent } from 'react';
import { addRecent } from '@/scripts/utils/fs/recent-chart';


async function openChart(path: string, name: string) {
    await addRecent({path, name});
    open('/editor?' + `path=${path}`, '_self');
}

export default function FileOption({name, path, isDir, openDir}: FileOptionProps) {
    const onClickHandler = isDir ? () => { openDir(name); } : (ev: MouseEvent) => { 
        if(ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey) return;
        openChart(path, name); 
    };

    return <div className={styles['file-option']} onClick={onClickHandler}>
        <span className={styles.icon}><Icon icon={isDir ? 'folder' : 'file-lines'} type={'solid'}/></span>{name}
    </div>;
}