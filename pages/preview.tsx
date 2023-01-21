import styles from '@styles/Preview.module.scss';

import Head from "next/head";
// import PIXI from '@pixi';
import { Stage } from '@inlet/react-pixi';
// import Scene from '@components/pixi/scene/scene';
// import Header from '@components/pages/preview/header/header';
// import Main from '@components/pages/preview/main/main';



export default function Preview() {

    return (
        <>
            <Head>
                <title>Re: AstEdit - Preview - Chart Editor for Astaeus - Vestar Team</title>
                <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
                <meta name="description" content="Chart Editor for Astaeus" />
                <meta name="author" content="Vestar Team" />
                <meta name="author" content="Yomli ヨムリ" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <div className={styles.main}>
                <Stage
                    className={styles.stage} 
                    width={960} 
                    height={540} 
                    options={{ backgroundColor: 0x000000, autoStart: false, antialias: true }}>
                </Stage>
            </div>
        </>
    );
}