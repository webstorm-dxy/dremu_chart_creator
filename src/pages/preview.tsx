import styles from '@styles/Preview.module.scss';

import Head from "next/head";
// import PIXI from '@pixi';
import PreviewScene from '@components/pixi/scenes/preview/preview';
import ChartData from '@scripts/chart-data/chart-data';
import ChartLine from '@scripts/chart-data/line';
import PixiApp from '@components/pixi/stage/pixi-app';
import { createRef, useState } from 'react';
import { PreviewControls, PreviewOptions } from '@/components/pixi/scenes/preview/preview.d';
import { InputNumber, Form, Switch, Drawer, Button } from 'antd';
import configs from '@scripts/manager/config';
import { Container } from '@pixi/react';

const tempChartData = new ChartData({ meta: { name: 'test' }, data: { lines: [new ChartLine({ id: 0, speed: 0, start: [0, 0] })] } });

const dev = true;

export default function Preview() {
    const audioRef = createRef<HTMLAudioElement>();
    const [showDrawwer, setShowDrawwer] = useState<boolean>(false);
    const [controls, setControls] = useState<PreviewControls>(configs.get('preview.controls'));
    const [options, setOptions] = useState<PreviewOptions>(configs.get('preview'));

    function setOption<T extends keyof PreviewOptions>(key: T, value: PreviewOptions[T]) {
        setOptions(prev => {
            prev[key] = value;

            return prev;
        });
    }

    function setControl<T extends keyof PreviewControls>(key: T, value: PreviewControls[T]) {
        setControls(prev => {
            prev[key] = value;

            return prev;
        });
    }

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
                    options={{ backgroundColor: 0x000000, autoStart: false, antialias: true }}>
                    <PreviewScene audio={audioRef} chart={tempChartData} viewWidth={960} viewHeight={540}
                        options={{ ...options, ...controls }} />
                </PixiApp>

                <div>
                    <audio style={{ height: '1rem', width: '100%' }} preload='auto' src='/default.ogg' controls={options.controls} ref={audioRef} />
                </div>

                <Button className={styles.controls} onClick={() => { setShowDrawwer(!showDrawwer); }} size='small'>修改参数</Button>

                {(options.controls || dev) && <Drawer open={showDrawwer} onClose={() => { setShowDrawwer(!showDrawwer); }}>
                    {options.controls && <Form size='small'>
                        <label>options:</label>
                        <Form.Item name='speed' label='流速'>
                            <InputNumber min={0.5} max={20} step={0.5}
                                defaultValue={options.speed}
                                value={options.speed}
                                onChange={v => setOption('speed', v)} />
                        </Form.Item>
                        <Form.Item name='showFPS' label='FPS'>
                            <Switch defaultChecked={controls.showFPS} onChange={(checked) => { setControl('showFPS', checked); }} />
                        </Form.Item>
                    </Form>}

                    {dev && <Form>
                        <div>dev:</div>
                        {/* <FractionInput style={{width: '6rem'}} value={new Fraction({s: 2, n: 17, d: 3})} size='small' onChange={v => { console.log(v.toFraction(true)); }}/> */}
                        {/* <Button onClick={() => { setOptions(prev => !prev); }}>缩放</Button> */}
                    </Form>}
                </Drawer>}
            </div>
        </>
    );
}