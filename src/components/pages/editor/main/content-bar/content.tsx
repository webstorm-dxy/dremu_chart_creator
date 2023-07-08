import TabsWindow from "@/components/tabs-window/tabs-window";
import { TabsProps } from "antd";
import { useState } from "react";

export default function Content() {
    const [tabsKey, setTabsKey] = useState<string>('');

    const tabItems: TabsProps['items'] = [
        {
            key: 'attr',
            label: '属性',
            children: ''
        }
    ];
    
    return <TabsWindow activeKey={tabsKey} divClassName="h-3/5" items={tabItems} onChange={key => setTabsKey(key)}/>;
}