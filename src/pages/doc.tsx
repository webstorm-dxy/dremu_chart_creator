import styles from '@/styles/Doc.module.scss';

import Label from "@/components/label/label";
import DocTree from "@/components/pages/doc/tree";
import useClassName from "@/hooks/use-class-name";
import { createWindow } from "@/scripts/manager/window-manager";
import { Button, Empty, Select } from "antd";
import { useMemo, useState } from "react";

export type IDocInfo = {
    key: string;
    title: string;
} & ({
    path: string;
    children?: IDocInfo[];
} | {
    path?: string;
    children: IDocInfo[];
})

export interface ISource {
    value: string;
    label?: string;
    path: string;
}

export interface IDocProps {
    docList?: IDocInfo[];
    sources?: ISource[];
    disabledOpenInNewWindow?: boolean;
}

export const defaultDocList: IDocInfo[] = [
    {
        key: 'files',
        title: '文件',
        children: [
            {
                key: 'file-type',
                title: '文件类型',
                path: '/docs/files/file-type'
            },
            {
                key: 'file-manager',
                title: '文件管理',
                path: '/docs/files/file-manager'
            }
        ]
    },
    {
        key: 'edit',
        title: '编辑',
        children: [
            {
                key: 'turn-to-editor',
                title: '进入编辑界面',
                path: '/docs/edit/turn-to-editor'
            },
            {
                key: 'first-check',
                title: '初次编辑检查',
                path: '/docs/edit/first-check'
            },
        ]
    }
];

export const defaultSources: ISource[] = [
    { value: "local", label: '本地', path: '' }
];

export default function Doc({ docList = defaultDocList, sources = defaultSources, disabledOpenInNewWindow = true }: IDocProps) {
    const [sourceKey, setSourceKey] = useState(sources[0]?.value || '');
    const [docKey, setDocKey] = useState('/docs/test-v0.1.2');

    const sourcePath = useMemo(
        () => sources?.find(source => source.value === sourceKey)?.path || '',
        [sourceKey, sources]
    );

    const docPath = useMemo(
        () => {
            function findDoc(list: IDocInfo[], key: string): IDocInfo | null {
                for (const info of list) {
                    if (info.key === key) return info;
                    if (info.children) {
                        const res = findDoc(info.children, key);
                        if (res) return res;
                    }
                }
                return null;
            }

            return sourcePath + (findDoc(docList, docKey)?.path || '');
        },
        [sourcePath, docKey, docList]
    );

    return <div className="max-h-full h-screen w-full">
        <div className="flex items-center h-8 w-full bg-white shadow relative z-20">
            <Label label="文档源"><Select size="small" value={sourceKey} options={sources} onChange={val => setSourceKey(val)} /></Label>
            {!disabledOpenInNewWindow && <Button size="small" onClick={() => createWindow('doc', { url: '/doc' })}>在新窗口打开</Button>}
        </div>
        <div className={useClassName("flex w-full bg-slate-50", styles.content)}>
            <DocTree className='z-10' docKey={docKey} docList={docList} setDocKey={setDocKey} />
            {!!docPath || <Empty className='h-full w-full mt-8' description="无页面"/>}
            {!!docPath && <iframe className="h-full w-full" src={docPath} />}
        </div>
    </div>;
}