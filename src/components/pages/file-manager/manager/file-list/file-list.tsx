import styles from './file-list.module.scss';

import {FileListProps} from './file-list.d';
import FileOption from './file-option/file-option';
import { Empty } from 'antd';
import { usePartial } from '@/hooks/use-partial';


export default function FileList({showFiles, openDir, path, sort}: FileListProps) {
    [openDir, path, sort] = usePartial([openDir, path, sort], [() => {}, [], () => 0]);
    
    
    return <div className={styles['file-list']}>
        {path.length > 0 && <FileOption key='back' name='..' isDir={true} openDir={() => { openDir('../'); }}/>}
        {showFiles.sort(sort).map(file => <FileOption key={file.name} name={file.name} path={'chart/' + path.join('/') + (path.length === 0 ? '' : '/') + file.name} isDir={!!file.children} openDir={openDir}></FileOption>)}
        {showFiles.length === 0 && <Empty className={styles.empty} description='没有任何结果捏'></Empty>}
    </div>;
}