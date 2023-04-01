import Scene from "@components/pixi/scene/scene";
import {EditorProps} from './editor.d';

export default function Editor(props: EditorProps) {
    const {viewWidth, viewHeight} = props;
    
    return <Scene name="editor" viewWidth={viewWidth ?? 1280} viewHeight={viewHeight ?? 720}>
        
    </Scene>;
}