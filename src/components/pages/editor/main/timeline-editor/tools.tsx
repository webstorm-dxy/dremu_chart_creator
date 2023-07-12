import Label from "@/components/label/label";
import { setRecordState } from "@/hooks/set-record-state";
import { Switch, Select, Slider, InputNumber } from "antd";
import { beatBars } from "@/scripts/data/beat-bar";
import { useMemo } from "react";
import ToolBar from "@/components/tool-bar/tool-bar";
import { EditorContext } from "@/context/editor/editor";
import { useStateContext } from "@/hooks/use-state-context";
import MusicControl from "./music-control";

export default function Tools() {
    const [editorContext, setEditorContext] = useStateContext(EditorContext);
    const { editorConfigs, timeline } = editorContext;
    const beatBarOptions = useMemo(() => beatBars.map(info => { return { value: info[1], label: `${info[0]}/${info[1]}` }; }), [beatBars]);

    return <>
        <ToolBar>
            <Label label="网格吸附"><Switch checked={editorConfigs.snip.gird} onChange={(c) => setRecordState(setEditorContext, prev => prev.editorConfigs.snip.gird = c)} /></Label>
            <Label label="对齐辅助线"><Switch checked={editorConfigs.snip.dragline} onChange={(c) => setRecordState(setEditorContext, prev => prev.editorConfigs.snip.dragline = c)} /></Label>
            <Label label="小结"><Select className="w-16" size="small" value={timeline.beatBar} options={beatBarOptions} onChange={v => setRecordState(setEditorContext, prev => prev.timeline.beatBar = v)} /></Label>
            <Label label="缩放"><Slider className="w-32" value={timeline.scaleWidth} min={40} max={640} step={40} tooltip={{ formatter: (v) => v / 1.6 + '%' }} onChange={v => setRecordState(setEditorContext, prev => prev.timeline.scaleWidth = v)} /></Label>
            <Label label="延迟"><InputNumber className='w-16' size='small' value={editorContext.chart?.meta.offset || 0} onChange={val => setRecordState(setEditorContext, prev => prev.chart?.setMeta('offset', val))} /></Label>
        </ToolBar>
        <ToolBar>
            <Label label="时间"><MusicControl /></Label>
        </ToolBar>
    </>;
}