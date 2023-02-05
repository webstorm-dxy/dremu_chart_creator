import Scene from "@components/pixi/scene/scene";
import { Loader, TextStyle } from "pixi.js";
import { Text } from "@inlet/react-pixi";
import { PreviewSceneProps } from './preview.d';
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Background from "./background/background";


let loaded: boolean = false;
const loader = new Loader();
async function loadAssets() : Promise<boolean>{
    if (loaded) return loaded;

    loader.reset();

    await new Promise((resolve) => {
        loader.add([{ key: 'bg', url: new URL('@images/bg.png', import.meta.url).href }])
            .load(() => { loaded = true; resolve(loaded); });
    });
    return loaded;
}

export default function PreviewScene(props: PreviewSceneProps) {
    const [isLoading, setIsLoading]: [boolean | undefined, Dispatch<SetStateAction<boolean>>] = useState(!loaded);

    useEffect(() => { 
        // 加载资源
        loadAssets().then(loaded => {
            console.log(loaded);
            setIsLoading(!loaded);
        });
    }, [isLoading]);

    const {viewWidth, viewHeight} = props;

    return <Scene name="preview" viewWidth={viewWidth} viewHeight={viewHeight}>
        {isLoading && <Text text="Loading" position={[viewWidth / 2, viewHeight / 2]} style={new TextStyle({ align: "center", fontSize: 72, fill: 0xffffff })} anchor={0.5}></Text>}
        {!isLoading && // 背景
            <Background texture={loader.resources['bg'].texture} viewWidth={viewWidth} viewHeight={viewHeight} mask={true} zIndex={-99}></Background>
        }
    </Scene>;
}