import styles from './timeline-editor.module.scss';

import { Button, Select, Slider, Space, Switch } from "antd";
import ToolBar from "@/components/tool-bar/tool-bar";
import { EditorContext } from "@/context/editor/editor";
import { setRecordState } from "@/hooks/set-record-state";
import { useStateContext } from "@/hooks/use-state-context";
import Label from "@/components/label/label";
import { beatBars } from "@/scripts/data/beat-bar";
import { Timeline, TimelineAction, TimelineRow, TimelineState } from "@xzdarcy/react-timeline-editor";
import { throttle } from "lodash";
import { UserConfigContext } from "@/context/user-config";
import { useEffect, useMemo, useRef } from "react";
import useClassName from "@/hooks/use-class-name";
import timelineEffects from '@/components/timeline-effect/effects';
import dayjs from 'dayjs';
import Icon from '@/components/icon/icon';
import { AudioManagerContext } from '@/components/audio-manager/audio-manager';

function actionRender(action: TimelineAction, row: TimelineRow) {
    return timelineEffects[action.effectId]?.(action, row);
}

export default function TimelineEditor() {
    const [editorContext, setEditorContext] = useStateContext(EditorContext);
    const [userConfigContext,] = useStateContext(UserConfigContext);
    const [audioManager, setAudioManager] = useStateContext(AudioManagerContext);
    const { music } = audioManager;
    const { editorConfigs, timeline } = editorContext;

    const timelineRef = useRef<TimelineState>(null);

    useEffect(() => {
        const tLine = timelineRef.current;
        if (tLine) {
            tLine.setTime(tLine.getTime());

            const timeArea = tLine.target.firstChild;

            const wheelEvent = throttle((ev: WheelEvent) => {
                const offset = (ev.deltaY > 0 ? 0.5 : -0.5)
                    * (userConfigContext.editor.wheelInversion ? -1 : 1)
                    * (ev.altKey ? 2 : 1);
                tLine.setTime(Math.max(tLine.getTime() + offset, 0));
                tLine.setScrollLeft(tLine.getTime() * timeline.scaleWidth);
            }, 100);

            timeArea.addEventListener('wheel', wheelEvent);

            return () => {
                timeArea.removeEventListener('wheel', wheelEvent);
            };
        }
    }, [timelineRef.current]);

    const beatBarOptions = useMemo(() => beatBars.map(info => { return { value: info[1], label: `${info[0]}/${info[1]}` }; }), [beatBars]);

    return <div className="w-full h-1/2 relative border-t-2 border-gray-200 overflow-hidden">
        <ToolBar>
            <Label label="网格吸附"><Switch checked={editorConfigs.snip.gird} onChange={(c) => setRecordState(setEditorContext, prev => prev.editorConfigs.snip.gird = c)} /></Label>
            <Label label="对齐辅助线"><Switch checked={editorConfigs.snip.dragline} onChange={(c) => setRecordState(setEditorContext, prev => prev.editorConfigs.snip.dragline = c)} /></Label>
            <Label label="小结"><Select className="w-16" size="small" value={timeline.beatBar} options={beatBarOptions} onChange={v => setRecordState(setEditorContext, prev => prev.timeline.beatBar = v)} /></Label>
            <Label label="缩放"><Slider className="w-32" value={timeline.scaleWidth} min={40} max={640} step={40} tooltip={{ formatter: (v) => v / 1.6 + '%' }} onChange={v => setRecordState(setEditorContext, prev => prev.timeline.scaleWidth = v)} /></Label>
        </ToolBar>
        <ToolBar>
            <Label label="时间"><Space>
                <Button type="text" shape='circle'><Icon icon={music?.state?.paused ? 'pause' : 'play'} /></Button>
                <Slider className="w-96" value={music?.state?.time || 0} min={0} max={music?.state?.duration || 0} tooltip={{ formatter: (v) => dayjs(v * 1000).format('mm:ss') }} />
                <Button type="text" shape='circle'><Icon icon={music?.state?.volume ? 'volume-high' : 'volume-xmark'}/></Button>
            </Space></Label>
        </ToolBar>
        <div className={useClassName("flex", styles['timeline-box'])}>
            <Timeline
                key={timeline.beatBar}
                ref={timelineRef}
                editorData={editorContext.timeline.data}
                effects={editorContext.timeline.effects}
                style={{ width: '100%', height: '100%' }}
                engine={editorContext.timeline.engine}
                getActionRender={actionRender}
                autoScroll={true}
                scale={1}
                scaleSplitCount={timeline.beatBar}
                scaleWidth={timeline.scaleWidth}
                gridSnap={editorConfigs.snip.gird}
                dragLine={editorConfigs.snip.dragline}
            />
        </div>
    </div>;
}