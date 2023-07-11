import styles from './timeline-editor.module.scss';

import { Button, InputNumber, Select, Slider, Space, Switch } from "antd";
import ToolBar from "@/components/tool-bar/tool-bar";
import { EditorContext } from "@/context/editor/editor";
import { setRecordState } from "@/hooks/set-record-state";
import { useStateContext } from "@/hooks/use-state-context";
import Label from "@/components/label/label";
import { beatBars } from "@/scripts/data/beat-bar";
import { Timeline, TimelineAction, TimelineRow, TimelineState } from "@xzdarcy/react-timeline-editor";
import { throttle } from "lodash";
import { UserConfigContext } from "@/context/user-config";
import { useContext, useEffect, useMemo, useRef } from "react";
import useClassName from "@/hooks/use-class-name";
import timelineEffects from '@/components/timeline-effect/effects';
import dayjs from 'dayjs';
import Icon from '@/components/icon/icon';
import { MusicContext } from '@/context/editor/music';
import Fraction from 'fraction.js';
import { useMount } from 'ahooks';
import { ChartNoteEventType } from '@/interfaces/chart-data/chart-data.d';

function actionRender(action: TimelineAction, row: TimelineRow) {
    return timelineEffects[action.effectId]?.(action, row);
}

export default function TimelineEditor() {
    const [editorContext, setEditorContext] = useStateContext(EditorContext);
    const [userConfigContext,] = useStateContext(UserConfigContext);
    const musicContext = useContext(MusicContext);

    const { editorConfigs, timeline } = editorContext;

    const timeOffset = editorContext.chart?.meta.offset / 1000 || 0;

    const timelineRef = useRef<TimelineState>(null);

    const beatBarOptions = useMemo(() => beatBars.map(info => { return { value: info[1], label: `${info[0]}/${info[1]}` }; }), [beatBars]);

    const timelineScaleLength = useMemo(
        () => (editorContext.chart?.meta.bpm.toBeat(musicContext.state.duration).valueOf() || 0) + 20,
        [editorContext.chart?.meta.bpm, musicContext.state.duration]
    );

    function setBeat(beat: number | Fraction) {
        musicContext.controls.seek(editorContext.chart?.meta.bpm?.toTime(new Fraction(beat)) - timeOffset || 0);
    }

    function setScrollLeft(beat: number | Fraction) {
        const offset = Math.max(0, (beat instanceof Fraction ? beat.valueOf() : beat) * timeline.scaleWidth - 40);
        timelineRef.current?.setScrollLeft(offset);
    }

    useMount(() => {
        editorContext.timeline.engine.on('beforeSetTime', ev => {
            setBeat(ev.time);
            return false;
        });
    });

    useEffect(() => {
        const tLine = timelineRef.current;
        if (tLine) {
            const timeArea = tLine.target.firstChild;

            const wheelEvent = throttle((ev: WheelEvent) => {
                const offset = (ev.deltaY > 0 ? 0.5 : -0.5)
                    * (userConfigContext.editor.wheelInversion ? -1 : 1)
                    * (ev.altKey ? 2 : 1);
                setBeat(Math.max(tLine.getTime() + offset, 0));
            }, 100);

            timeArea.addEventListener('wheel', wheelEvent);

            return () => {
                timeArea.removeEventListener('wheel', wheelEvent);
            };
        }
    }, [timelineRef.current]);

    useEffect(() => {
        const tLine = timelineRef.current;
        if (tLine) {
            const bpm = editorContext.chart?.meta.bpm;
            editorContext.timeline.engine.setBeat(bpm?.toBeat(musicContext.state.time + timeOffset) || 0, true);
            setScrollLeft(tLine.getTime());
        }
    }, [timelineRef.current, musicContext.state.time]);

    useEffect(() => {
        const line = editorContext.chart?.getLine(editorContext.editing.line);

        if(!line) return;

        setRecordState(setEditorContext, prev => {
            prev.timeline.data = [
                {
                    id: 'notes',
                    actions: line.notes.map((note, i) => {
                        return {
                            id: 'note-' + i,
                            start: note.time.valueOf(),
                            end: note.type === ChartNoteEventType.Hold ? note.endTime.valueOf() : note.time.valueOf(),
                            effectId: 'note-' + note.type,
                            flexible: note.type === ChartNoteEventType.Hold
                        };
                    }),
                }
            ];
        });
    }, [editorContext.editing.line]);

    console.log(timeline.data);

    return <div className="w-full h-1/2 relative border-t-2 border-gray-200 overflow-hidden">
        <ToolBar>
            <Label label="网格吸附"><Switch checked={editorConfigs.snip.gird} onChange={(c) => setRecordState(setEditorContext, prev => prev.editorConfigs.snip.gird = c)} /></Label>
            <Label label="对齐辅助线"><Switch checked={editorConfigs.snip.dragline} onChange={(c) => setRecordState(setEditorContext, prev => prev.editorConfigs.snip.dragline = c)} /></Label>
            <Label label="小结"><Select className="w-16" size="small" value={timeline.beatBar} options={beatBarOptions} onChange={v => setRecordState(setEditorContext, prev => prev.timeline.beatBar = v)} /></Label>
            <Label label="缩放"><Slider className="w-32" value={timeline.scaleWidth} min={40} max={640} step={40} tooltip={{ formatter: (v) => v / 1.6 + '%' }} onChange={v => setRecordState(setEditorContext, prev => prev.timeline.scaleWidth = v)} /></Label>
            <Label label="延迟"><InputNumber className='w-16' size='small' value={editorContext.chart?.meta.offset || 0} onChange={val => setRecordState(setEditorContext, prev => prev.chart?.setMeta('offset', val))}/></Label>
        </ToolBar>
        <ToolBar>
            <Label label="时间"><Space>
                <Button type="text" shape='circle' onClick={() => musicContext.state.paused ? musicContext.controls.play() : musicContext.controls.pause()}><Icon icon={musicContext.state.paused ? 'play' : 'pause'} /></Button>
                <Slider className="w-96" value={musicContext.state.time || 0} min={0} max={musicContext.state.duration || 0} step={0.01} tooltip={{ formatter: (v) => dayjs(v * 1000).format('mm:ss.SSS') }} onChange={v => { musicContext?.controls?.seek(v); }} />
                <Button type="text" shape='circle'><Icon icon={musicContext?.state?.muted ? 'volume-xmark' : 'volume-high'} /></Button>
            </Space></Label>
        </ToolBar>
        <div className={useClassName("flex", styles['timeline-box'])}>
            <Timeline
                key={timeline.beatBar}
                ref={timelineRef}
                editorData={editorContext.timeline.data}
                effects={editorContext.timeline.effects}
                onChange={() => {}}
                style={{ width: '100%', height: '100%' }}
                engine={editorContext.timeline.engine}
                getActionRender={actionRender}
                autoScroll={true}
                scale={1}
                scaleSplitCount={timeline.beatBar}
                scaleWidth={timeline.scaleWidth}
                minScaleCount={timelineScaleLength}
                maxScaleCount={Number.MAX_SAFE_INTEGER}
                gridSnap={editorConfigs.snip.gird}
                dragLine={editorConfigs.snip.dragline}
            />
        </div>
    </div>;
}