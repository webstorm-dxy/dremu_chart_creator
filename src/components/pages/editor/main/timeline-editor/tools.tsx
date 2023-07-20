import Label from "@/components/label/label";
import { setRecordState } from "@/hooks/set-record-state";
import { Switch, Select, Slider, InputNumber, Popover, Button, Form, Space } from "antd";
import { beatBars } from "@/scripts/data/beat-bar";
import { useEffect, useMemo } from "react";
import ToolBar from "@/components/tool-bar/tool-bar";
import { EditorContext } from "@/context/editor/editor";
import { ISetAction, useStateContext } from "@/hooks/use-state-context";
import MusicControl from "./music-control";
import { IUserConfigContext, UserConfigContext } from "@/context/user-config";
import { ISetKeySoundAttrs, setKeySound } from "@/scripts/timeline/key-sound";

export function KeySoundSetting({ data, setAction }: { data: Record<string, ISetKeySoundAttrs | null>, setAction: ISetAction<IUserConfigContext> }) {

    function getFormItem(key: string) {
        if (!data) return null;
        const src = data[key]?.src;
        return <Form.Item label={key}><Space>
            <Switch checked={!!data[key]} checkedChildren="启用" unCheckedChildren="禁用" onChange={c => setRecordState(setAction, prev => c ? prev.editor.keySound[key] = { src: `/audio/key-sound/0.wav` } : prev.editor.keySound[key] = null)} />
            {!!data[key] && <Form.Item rules={[{ type: 'number', min: 0, max: 13, pattern: /^-?\d+$/ }]}>
                <InputNumber min='0' max='13' value={src?.slice(src.lastIndexOf('/') + 1, src.lastIndexOf('.wav')) || 0} onChange={value => setRecordState(setAction, prev => prev.editor.keySound[key].src = `/audio/key-sound/${value}.wav`)} />
            </Form.Item>}
        </Space></Form.Item>;
    }

    return <Form className="w-48" size="small" layout="inline">
        {getFormItem('tap')}
        {getFormItem('hold')}
        {getFormItem('darg')}
        {getFormItem('flick')}
    </Form>;
}

export default function Tools() {
    const [userConfigContext, setUserConfigContext] = useStateContext(UserConfigContext);
    const [editorContext, setEditorContext] = useStateContext(EditorContext);
    const { editorConfigs, timeline } = editorContext;
    const beatBarOptions = useMemo(() => beatBars.map(info => { return { value: info[1], label: `${info[0]}/${info[1]}` }; }), [beatBars]);

    useEffect(() => {
        const sounds = userConfigContext.editor.keySound;
        for (const key in sounds) {
            setKeySound(key, sounds[key]);
        }
    });

    return <>
        <ToolBar>
            <Label label="网格吸附"><Switch checked={timeline.snip.gird} onChange={(c) => setRecordState(setEditorContext, prev => prev.timeline.snip.gird = c)} /></Label>
            <Label label="对齐辅助线"><Switch checked={timeline.snip.dragline} onChange={(c) => setRecordState(setEditorContext, prev => prev.timeline.snip.dragline = c)} /></Label>
            <Label label="添加时对齐网格"><Switch checked={editorConfigs.createActionSnip} onChange={(c) => setRecordState(setEditorContext, prev => prev.editorConfigs.createActionSnip = c)} /></Label>
            <Label label="小结"><Select className="w-16" size="small" value={timeline.beatBar} options={beatBarOptions} onChange={v => setRecordState(setEditorContext, prev => prev.timeline.beatBar = v)} /></Label>
            <Label label="缩放"><Slider className="w-32" value={timeline.scaleWidth} min={40} max={640} step={40} tooltip={{ formatter: (v) => v / 1.6 + '%' }} onChange={v => setRecordState(setEditorContext, prev => prev.timeline.scaleWidth = v)} /></Label>
            <Label label="轨道高度"><Slider className="w-32" value={timeline.rowHeight} min={12} max={68} step={4} tooltip={{ formatter: (v) => v / 0.32 + '%' }} onChange={v => setRecordState(setEditorContext, prev => prev.timeline.rowHeight = v)} /></Label>
            <Label label="延迟"><InputNumber className='w-16' size='small' value={editorContext.chart?.meta.offset || 0} onChange={val => setRecordState(setEditorContext, prev => prev.chart?.setMeta('offset', val))} /></Label>
            <Popover trigger="click" destroyTooltipOnHide content={<KeySoundSetting data={userConfigContext.editor.keySound} setAction={setUserConfigContext} />}><Button size="small">调整Key音</Button></Popover>
        </ToolBar>
        <ToolBar>
            <Label label="时间"><MusicControl /></Label>
        </ToolBar>
    </>;
}