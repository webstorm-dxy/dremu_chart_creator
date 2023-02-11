import styles from '@styles/Preview.module.scss';

import Head from "next/head";
// import PIXI from '@pixi';
import PreviewScene from '@components/pixi/scenes/preview/preview';
import ChartData from '@scripts/chart-data/chart-data';
import ChartLine from '@scripts/chart-data/line';
import PixiApp from '@components/pixi/stage/pixi-app';
import { createRef, RefObject, useState } from 'react';
import Button from '@components/button/button';

const tempChartData = new ChartData({meta: {name: 'test'}, data: {lines: [new ChartLine({id: 0, speed: 0, start: [0, 0]})]}});

const dev = true;

export default function Preview() {
    const audioRef: RefObject<HTMLAudioElement> = createRef();
    const [disableScale, setDisableScale] = useState(false);

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
                    cls={styles.stage} 
                    width={960}
                    height={540}
                    options={{ backgroundColor: 0x000000, autoStart: false, antialias: true}}>
                        <PreviewScene audio={audioRef} chart={tempChartData} viewWidth={960} viewHeight={540} disableScale={disableScale}></PreviewScene>
                </PixiApp>
                <audio style={{position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', height: '1rem', width: '80vw'}} preload='auto' src='/default.ogg' controls ref={audioRef}></audio>
                {dev && <>
                    <Button onClickHandler={() => { setDisableScale(prev => !prev); }}>缩放</Button>
                </>}
            </div>
        </>
    );
}