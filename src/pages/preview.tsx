import styles from '@styles/Preview.module.scss';

import Head from "next/head";
// import PIXI from '@pixi';
import PreviewScene from '@components/pixi/scenes/preview/preview';
import ChartData from '@scripts/chart-data/chart-data';
import ChartLine from '@scripts/chart-data/line';
import PixiApp from '@components/pixi/stage/pixi-app';
// import Scene from '@components/pixi/scene/scene';
// import Header from '@components/pages/preview/header/header';
// import Main from '@components/pages/preview/main/main';

const tempChartData = new ChartData({meta: {name: 'test'}, data: {lines: [new ChartLine({id: 0, speed: 0, start: [0, 0]})]}});

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
                <PixiApp
                    raf={false}
                    cls={styles.stage} 
                    width={960}
                    height={540}
                    options={{ backgroundColor: 0x000000, autoStart: false, antialias: true }}>
                        <PreviewScene chart={tempChartData} viewWidth={960} viewHeight={540}></PreviewScene>
                </PixiApp>
            </div>
        </>
    );
}