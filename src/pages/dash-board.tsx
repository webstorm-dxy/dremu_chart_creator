import styles from '@styles/FileManager.module.scss';

import { useState } from 'react';
import LeftBar from '@components/pages/dash-board/left-bar/left-bar';
import Manager from '@components/pages/dash-board/manager/manager';

/** 模块及对应键名 */
export enum PLATES {
    EDITOR = 'editor',
    RECENTLY = 'recently',
    FILE_SYSTEM = 'fileSystem',
    TOOLBOX = 'toolbox',
    DOC = 'doc'
}

/** 主页 */
export default function DashBoard() {
    // 管理模块显示状态
    const [plate, setPlate] = useState<PLATES>(PLATES.EDITOR);

    return <div className={styles.main}>
        <LeftBar plate={plate} setPlate={setPlate}></LeftBar>
        <Manager plate={plate} props={{ disabledOpenInNewWindow: false }} />
    </div>;
}