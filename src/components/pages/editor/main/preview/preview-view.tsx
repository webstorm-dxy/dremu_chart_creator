import styles from './preview.module.scss';

import { Switch } from "antd";
import ToolBar from "@/components/tool-bar/tool-bar";
import { EditorContext } from "@/context/editor/editor";
import { setRecordState } from '@/hooks/set-record-state';
import useClassName from "@/hooks/use-class-name";
import { useStateContext } from "@/hooks/use-state-context";
import { throttle } from "lodash";
import { WheelEventHandler, useCallback, useContext } from "react";
import Label from '@/components/label/label';
import PercentInput from '@/components/percentInput/percentInput';
import { UserConfigContext } from '@/context/user-config';
import { MusicContext } from '@/context/editor/music';

const height: number = 540;
const width: number = height / 9 * 16;

export default function PreviewView() {
    const [editorContext, setEditorContext] = useStateContext(EditorContext);
    const [userConfigContext,] = useStateContext(UserConfigContext);
    const { ref: musicRef } = useContext(MusicContext);

    const setScale = (scale: number | ((prevScale: number) => number)) => setRecordState(
        setEditorContext,
        prev => prev.editorConfigs.preview.scale =
            Math.min(Math.max(scale instanceof Function ? scale(prev.editorConfigs.preview.scale) : scale, 0.1), 4)
    );

    const onWheelHandler: WheelEventHandler<HTMLDivElement> = useCallback(throttle((ev) => {
        if (ev.altKey) {
            setScale(prev => prev + (ev.deltaY > 0 ? -0.1 : 0.1) * (userConfigContext.editor.wheelInversion ? -1 : 1));
        }
    }, 100), []);

    return <div className="h-1/2 relative overflow-hidden">
        <ToolBar>
            <Label label="预览"><Switch checked={!editorContext.editorConfigs.preview.paused} checkedChildren="启用" unCheckedChildren="禁用" onChange={c => setRecordState(setEditorContext, prev => prev.editorConfigs.preview.paused = !c)} /></Label>
            <Label label='缩放'><PercentInput className="w-16" step={0.1} size='small' value={editorContext.editorConfigs.preview.scale} onChange={v => setScale(Number(v) || 0)} /></Label>
        </ToolBar>
        <div className={useClassName("overflow-auto", styles['preview-container'])} onWheel={onWheelHandler}>
            {/* <PixiApp
                className="bg-black max-h-full max-w-full relative top-1/2 left-1/2 object-cover -translate-x-1/2 -translate-y-1/2"
                style={{ transform: `translate(-50%, -50%) scale(${editorContext.editorConfigs.preview.scale})` }}
                width={width}
                height={height}
                paused={editorContext.editorConfigs.preview.paused}
            >
                {!!editorContext.chart && <PreviewScene chart={editorContext.chart}
                    time={musicRef.current?.currentTime || 0} />}
            </PixiApp> */}
        </div>
        {/* <div className="h-16"></div> */}
    </div >;
}