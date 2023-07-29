import Icon from "@/components/icon/icon";
import Label from "@/components/label/label";
import { EditorContext } from "@/context/editor/editor";
import { MusicContext } from "@/context/editor/music";
import { setRecordState } from "@/hooks/set-record-state";
import useHotkey from "@/hooks/use-hotkey";
import { useStateContext } from "@/hooks/use-state-context";
import range from "@/scripts/utils/range";
import { Space, Button, Slider, Popover } from "antd";
import dayjs from "dayjs";
import { useContext, useEffect } from "react";

let playing = false;
export default function MusicControl() {
    const musicContext = useContext(MusicContext);
    const [editorContext, setEditorContext] = useStateContext(EditorContext);
    const { timeline } = editorContext;

    useEffect(() => {
        if (!musicContext?.ref?.current) {
            setRecordState(setEditorContext, prev => prev.timeline.playRate = 1);
            return;
        }
        if (musicContext.ref.current.playbackRate === timeline.playRate) return;
        musicContext.ref.current.playbackRate = range(timeline.playRate, 0.25, 4);
        if (musicContext.ref.current.playbackRate !== timeline.playRate)
            setRecordState(setEditorContext, prev => prev.timeline.playRate = musicContext.ref.current.playbackRate);
    }, [timeline.playRate]);

    useHotkey('resetPlayRate', () => { setRecordState(setEditorContext, prev => prev.timeline.playRate = range(1, 0.25, 4)); });
    useHotkey('addPlayRate', () => { setRecordState(setEditorContext, prev => prev.timeline.playRate = range(prev.timeline.playRate - 0.25, 0.25, 4)); });
    useHotkey('subPlayRate', () => { setRecordState(setEditorContext, prev => prev.timeline.playRate = range(prev.timeline.playRate + 0.25, 0.25, 4)); });

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
                    if (!musicContext?.state.volume) musicContext?.controls?.volume(0.5);
                } else musicContext?.controls?.mute();
                ev.target.blur?.();
            }}><Icon icon={musicContext?.state?.muted || !musicContext?.state.volume ? 'volume-xmark' : 'volume-high'} /></Button>
        </Popover>
        <Label label="播放速度"><Slider className="w-32" value={timeline.playRate} min={0.25} max={4} step={0.25} tooltip={{ formatter: (v) => v + '倍' }} onChange={v => setRecordState(setEditorContext, prev => prev.timeline.playRate = range(v, 0.25, 4))} /></Label>
    </Space>;
}