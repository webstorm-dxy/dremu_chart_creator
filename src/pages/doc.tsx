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
    className?: string;
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
                key: 'guide',
                title: '界面',
                path: '/docs/edit/guide',
                children: [
                    {
                        key: 'game-view',
                        title: '游戏视图',
                        path: '/docs/edit/guide/game-view'
                    }
                ]
            },
            {
                key: 'first-check',
                title: '初次编辑检查',
                path: '/docs/edit/first-check'
            },
            {
                key: 'line',
                title: '线',
                path: '/docs/edit/line',
                children: [
                    {
                        key: 'manage',
                        title: '管理线',
                        path: '/docs/edit/line/manage'
                    },
                    {
                        key: 'attr',
                        title: '线的属性',
                        path: '/docs/edit/line/attr',
                    },
                    {
                        key: 'event',
                        title: '线的事件',
                        path: '/docs/edit/line/event',
                        children: [
                            {
                                key: 'universal',
                                title: '通用属性',
                                path: '/docs/edit/line/event/universal'
                            },
                            {
                                key: 'ease-map',
                                title: '缓动表',
                                path: '$https://easings.net/zh-cn'
                            },
                            {
                                key: 'notes',
                                title: 'Notes',
                                path: '/docs/edit/line/event/notes'
                            },
                            {
                                key: 'dots',
                                title: 'Dots',
                                path: '/docs/edit/line/event/dots'
                            },
                            {
                                key: 'moves',
                                title: 'Moves',
                                path: '/docs/edit/line/event/moves'
                            },
                            {
                                key: 'alphas',
                                title: 'Alphas',
                                path: '/docs/edit/line/event/alphas'
                            },
                            {
                                key: 'rotates',
                                title: 'Rotates',
                                path: '/docs/edit/line/event/rotates'
                            },
                            {
                                key: 'timings',
                                title: 'Timings',
                                path: '/docs/edit/line/event/timings'
                            }
                        ]
                    }
                ]
            },
            {
                key: 'timeline',
                title: '时间轴',
                children: [
                    {
                        key: 'set-time',
                        title: '设置时间',
                        path: '/docs/edit/timeline/set-time'
                    },
                    {
                        key: 'edit-events',
                        title: '编辑事件',
                        path: '/docs/edit/timeline/edit-events'
                    },
                    {
                        key: 'attrs',
                        title: '时间轴属性',
                        path: '/docs/edit/timeline/attrs'
                    }
                ]
            },
            {
                key: 'chart',
                title: '谱面',
                path: '/docs/edit/chart'
            },
            {
                key: 'other',
                title: '其它操作',
                path: '/docs/edit/other'
            }
        ]
    },
    {
        key: 'preview',
        title: '预览',
        path: '/docs/preview'
    },
];

export const defaultSources: ISource[] = [
    { value: "local", label: '本地', path: '' }
];

export default function Doc({ className, docList = defaultDocList, sources = defaultSources, disabledOpenInNewWindow = true }: IDocProps) {
    const [sourceKey, setSourceKey] = useState(sources[0]?.value || '');
    const [docKey, setDocKey] = useState('/docs/test-v0.1.2');

    // 文档源的路劲前缀获取
    const sourcePath = useMemo(
        () => sources?.find(source => source.value === sourceKey)?.path || '',
        [sourceKey, sources]
    );

    // 获得文档的页面路径
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
            const docPath = findDoc(docList, docKey)?.path || '';

            if (docPath[0] === '$') return docPath.slice(1);
            return sourcePath + docPath;
        },
        [sourcePath, docKey, docList]
    );

    return <div className={useClassName(className.includes('h-') || 'h-screen', "max-h-full w-full overflow-hidden", className)}>
        <div className="flex items-center h-8 w-full bg-white shadow relative z-20">
            <Label label="文档源"><Select size="small" value={sourceKey} options={sources} onChange={val => setSourceKey(val)} /></Label>
            {!disabledOpenInNewWindow && <Button size="small" onClick={() => createWindow('doc', { url: '/doc' })}>在新窗口打开</Button>}
        </div>
        <div className={useClassName("relative flex w-full bg-slate-50", styles.content)}>
            <DocTree className='z-10' docKey={docKey} docList={docList} setDocKey={setDocKey} />
            {!!docPath || <Empty className='h-full w-full mt-8' description="无页面" />}
            {!!docPath && <iframe className="h-full w-full" src={docPath} />}
        </div>
    </div>;
}