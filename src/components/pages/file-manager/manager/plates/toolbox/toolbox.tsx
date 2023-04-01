import styles from './toolbox.module.scss';

import { Empty, Segmented } from "antd";
import { ReactNode, useMemo, useState } from "react";
import { IToolPage } from "./tool-page";
import BPM from "./tool-pages/bpm/bpm";

const toolPages: IToolPage[] = [
    {
        name: 'bpm',
        showName: 'BPM 测量工具',
        page: <BPM />
    }
];

export default function Toolbox() {
    const [tool, setTool] = useState<string>(toolPages[0]?.name || '');

    const toolPageNode: ReactNode = useMemo(() => {
        return toolPages.find(page => page.name === tool)?.page || <Empty description='没有工具内' />;
    }, [tool]);

    return <>
        <div className={styles['tool-list']}>
            <Segmented
                block
                options={toolPages.map(tool => {
                    return {
                        label: tool.showName,
                        value: tool.name,
                        icon: tool.icon
                    };
                })} onChange={(v) => {
                    console.log(v);
                    setTool(`${v}`);
                }} />
        </div>
        <div className={styles['tool-page']}>
            {toolPageNode}
        </div>
    </>;
}