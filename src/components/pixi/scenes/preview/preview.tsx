import Scene from "@components/pixi/scene/scene";
import { Loader, TextStyle } from "pixi.js";
import { Container, Text, useTick } from "@inlet/react-pixi";
import { PreviewSceneProps } from './preview.d';
import { useEffect, useState } from "react";
import Background from "./background/background";
import { chart } from "@components/pages/preview/chart.tem";
import FCState from "@interfaces/function-component-state";
import Line from "./line/line";



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
    const audio: HTMLAudioElement = props.audio.current;
    const [isLoading, setIsLoading]: FCState<boolean> = useState(!loaded);
    const [time, setTime]: FCState<number> = useState(audio?.currentTime || 0);
    const [fps, setFps]: FCState<number> = useState(0);

    useEffect(() => {
        // 加载资源
        loadAssets().then(loaded => {
            setIsLoading(!loaded);
        });
    }, [isLoading]);

    useTick((delta, ticker) => {
        // ticker.maxFPS = 30;
        setFps(Math.round(ticker.FPS));
        setTime(audio?.currentTime || 0);
    });

    const { viewWidth, viewHeight, disableScale } = props;

    return <Scene name="preview" viewWidth={viewWidth} viewHeight={viewHeight}>
        {isLoading && <Text text="Loading" position={[viewWidth / 2, viewHeight / 2]} style={new TextStyle({ align: "center", fontSize: 72, fill: 0xffffff })} anchor={0.5}></Text>}
        {!isLoading && <>
                {/* 背景 */}
                <Background texture={loader.resources['bg']?.texture} width={viewWidth} height={viewHeight} mask={true} zIndex={-99}></Background>
                {/* FPS */}
                <Text position={[10, 20]} text={'FPS: '+ fps} style={new TextStyle({ align: "center", fontSize: 20, fill: 0xffffff })}></Text>
            </>
        }
        {/* 主要部分 */}
        {!isLoading && <Container key={time} position={[viewWidth / 2, viewHeight / 2]} anchor={0.5} scale={disableScale ? [1, -1] : [viewWidth / width, 0 - viewHeight / height]}>
            {chart.data.lines.map(lineData => <Line key={lineData.id}
                time={time}
                data={lineData} />)}
        </Container>}
    </Scene>;
}