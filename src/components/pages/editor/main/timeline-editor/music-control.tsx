import Icon from "@/components/icon/icon";
import Label from "@/components/label/label";
import { MusicContext } from "@/context/editor/music";
import { Space, Button, Slider, Popover } from "antd";
import dayjs from "dayjs";
import { useContext } from "react";

let playing = false;
export default function MusicControl() {
    const musicContext = useContext(MusicContext);

    return <Space>
        <Button type="text" onKeyDown={ev => ev.preventDefault()} shape='circle' onClick={() => musicContext.state.paused ? musicContext.controls.play() : musicContext.controls.pause()}><Icon icon={musicContext.state.paused ? 'play' : 'pause'} /></Button>
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
        <Popover content={<Label label="音量"><Slider className="w-48" value={musicContext?.state.volume * 100} disabled={musicContext?.state.muted} min={0} max={100} tooltip={{ formatter: val => val + '%' }} onChange={val => musicContext?.controls.volume(val / 100)} /></Label>}>
            <Button onKeyDown={ev => ev.preventDefault()} type="text" shape='circle' onClick={(ev) => {
                if (musicContext?.state.muted || !musicContext?.state.volume) {
                    musicContext?.controls?.unmute();
                    if(!musicContext?.state.volume) musicContext?.controls?.volume(0.5);
                } else musicContext?.controls?.mute();
                ev.target.blur?.();
            }}><Icon icon={musicContext?.state?.muted || !musicContext?.state.volume ? 'volume-xmark' : 'volume-high'} /></Button>
        </Popover>
    </Space>;
}