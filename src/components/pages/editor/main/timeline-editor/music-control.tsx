import Icon from "@/components/icon/icon";
import { MusicContext } from "@/context/editor/music";
import { Space, Button, Slider } from "antd";
import dayjs from "dayjs";
import { useContext } from "react";

export default function MusicControl(props) {
    let playing = false;

    return ((props) => {
        const musicContext = useContext(MusicContext);
        // const sliderRef = useRef<>(null);

        // useEffect(() => {
        //     const sliderEl = sliderRef.current;
        //     if (!sliderEl) return;

        //     let playing = false;

        //     const onMouseDownHandler = () => { 
        //         if (musicContext.state.playing) {
        //             playing = true;
        //             musicContext.controls.pause();
        //         }
        //     };
        //     const onMouseUpHandler = () => {
        //         if (playing) {
        //             playing = false;
        //             musicContext.controls.play();
        //         }
        //     };

        //     sliderEl.addEventListener('mousedown', onMouseDownHandler);
        //     sliderEl.addEventListener('mousedown', onMouseUpHandler);

        //     return () => {
        //         sliderEl.removeEventListener('mousedown', onMouseDownHandler);
        //         sliderEl.removeEventListener('mousedown', onMouseUpHandler);
        //     };
        // }, [sliderRef]);

        return <Space>
            <Button type="text" shape='circle' onClick={() => musicContext.state.paused ? musicContext.controls.play() : musicContext.controls.pause()}><Icon icon={musicContext.state.paused ? 'play' : 'pause'} /></Button>
            <Slider /* ref={sliderRef} */ className="w-96" value={musicContext.state.time || 0} min={0} max={musicContext.state.duration || 0} step={0.01} tooltip={{ formatter: (v) => dayjs(v * 1000).format('mm:ss.SSS') }}
                onChange={v => {
                    if (!musicContext?.ref?.current?.paused) {
                        if (!playing) musicContext.controls.pause();
                        playing = true;
                    }
                    musicContext?.controls?.seek(v);
                }}
                onAfterChange={() => {
                    if (playing) {
                        playing = false;
                        musicContext?.controls?.play();
                    }
                }} />
            <Button type="text" shape='circle'><Icon icon={musicContext?.state?.muted ? 'volume-xmark' : 'volume-high'} /></Button>
        </Space>;
    })(props);
}