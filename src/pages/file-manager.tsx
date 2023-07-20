import LeftBar from '@components/pages/file-manager/left-bar/left-bar';
import Manager from '@components/pages/file-manager/manager/manager';
import styles from '@styles/FileManager.module.scss';

import Head from "next/head";
import { useState } from 'react';


export enum PLATES {
    EDITOR = 'editor',
    RECENTLY = 'recently',
    FILE_SYSTEM = 'fileSystem',
    TOOLBOX = 'toolbox',
    DOC = 'doc'
}


export default function FileManager() {
    const [plate, setPlate] = useState<PLATES>(PLATES.EDITOR);

    return (
        <>
            <Head>
                <title>Re: AstEdit - Chart Editor for Astaeus - Vestar Team</title>
                <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
            </Head>
            <div className={styles.main}>
                <LeftBar plate={plate} setPlate={setPlate}></LeftBar>
                <Manager plate={plate} props={{ disabledOpenInNewWindow: false }} />
            </div>
        </>
    );
}