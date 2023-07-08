import Scene from "@components/pixi/scene/scene";
import { Loader, TextStyle } from "pixi.js";
import { Container, Text, useTick } from "@pixi/react";
import { PreviewControls, PreviewOptions, PreviewSceneProps } from './preview.d';
import { createContext, useEffect, useState } from "react";
import Background from "./background/background";
import { chart } from "@components/pages/preview/chart.tem";
import Line from "./line/line";
import { CoordinateTransformer } from "@scripts/pixi/scenes/preview/coordinate-transform";
import configs from '@scripts/manager/config';


const previewConfig = configs.get('preview');
const defaultConfigs: PreviewOptions & PreviewControls = { ...previewConfig, ...configs.get('preview.controls') };

export const OptionsContext = createContext(defaultConfigs);
export const TransformerContext = createContext(new CoordinateTransformer(0));

const height = 10;
const width = height / 9 * 16;

let loaded: boolean = false;
const loader = new Loader();
async function loadAssets(): Promise<boolean> {
    if (loaded) return loaded;

    loader.reset();

    await new Promise((resolve) => {
        loader.add([{ key: 'bg', url: new URL('@images/bg.png', import.meta.url).href }])
            .load(() => { loaded = true; resolve(loaded); });
    });
    return loaded;
}

export default function PreviewScene(props: PreviewSceneProps) {
    const { viewWidth = 960, viewHeight = 540 } = props;
    const options = { ...defaultConfigs, ...props.options };
    const transformer = new CoordinateTransformer(viewHeight);

    // states
    const [isLoading, setIsLoading] = useState<boolean>(!loaded);
    const [time, setTime] = useState<number>(0);
    const [fps, setFps] = useState<number>(0);
    // console.log(options, { ...defaultConfigs, ...props.options });

    useEffect(() => {
        if (!loaded)
            // 加载资源
            loadAssets().then(loaded => {
                setIsLoading(!loaded);
            });
    }, [isLoading]);

    useTick((delta, ticker) => {
        ticker.maxFPS = previewConfig.maxFPS || 0;
        ticker.minFPS = previewConfig.minFPS ?? 0;
        setFps(Math.round(ticker.FPS));
        setTime(0);
    });

    return <Scene name="preview" viewWidth={viewWidth} viewHeight={viewHeight}>
        <OptionsContext.Provider value={options}>
            <TransformerContext.Provider value={transformer}>
                {isLoading && <Text text="Loading" position={[viewWidth / 2, viewHeight / 2]} style={new TextStyle({ align: "center", fontSize: 72, fill: 0xffffff })} anchor={0.5}></Text>}
                {!isLoading && <>
                    {/* 背景 */}
                    <Background texture={loader.resources['bg']?.texture} width={viewWidth} height={viewHeight} mask={true} zIndex={-99}></Background>
                    {/* FPS */}
                    {options.showFPS && <Text position={[10, 20]} text={'FPS: ' + fps} style={new TextStyle({ align: "center", fontSize: 20, fill: 0xffffff })} />}
                </>
                }


                {/* 主要渲染部分 */}
                {!isLoading && <Container key={time}
                    position={[viewWidth / 2, viewHeight / 2]}
                    anchor={0.5}
                    scale={[1, -1]}>
                    {chart.data.lines.map(lineData => <Line key={lineData.id}
                        time={time}
                        data={lineData} />)}
                </Container>}

            </TransformerContext.Provider>
        </OptionsContext.Provider>
    </Scene>;
}