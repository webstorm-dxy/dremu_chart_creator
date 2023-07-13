import BPMEditor from "@/components/bpm-editor/bpm-editor";
import TabsWindow from "@/components/tabs-window/tabs-window";
import { EditorContext } from "@/context/editor/editor";
import { useStateContext } from "@/hooks/use-state-context";
import { TabsProps } from "antd";
import { useState } from "react";
import LineManager from "./line-manager";

export default function MaterialManager() {
    const [editorValue,] = useStateContext(EditorContext);
    const {chart} = editorValue;
    const [tabsKey, setTabsKey] = useState<string>('line');

    const tabItems: TabsProps['items'] = [
        {
            key: 'line',
            label: '线',
            children: <LineManager />
        },
        {
            key: 'bpm',
            label: 'BPM',
            children: <BPMEditor bpm={chart?.meta.bpm}/>
        }
    ];
    
    return <TabsWindow divClassName="h-2/5 border-t-2" items={tabItems} activeKey={tabsKey} onChange={key => setTabsKey(key)}/>;
}