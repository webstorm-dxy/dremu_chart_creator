import Label from "@/components/label/label";
import useClassName from "@/hooks/use-class-name";
import { ISetAction } from "@/hooks/use-state-context";
import { IDocInfo } from "@/pages/doc";
import { Input, Tree } from "antd";
import { cloneDeep } from "lodash";
import { useEffect, useMemo, useState } from "react";

export interface IDocTreeProps {
    className?: string;
    docKey: string;
    docList: IDocInfo[];
    setDocKey: ISetAction<string>;
}

export default function DocTree({ className, docKey, docList, setDocKey }: IDocTreeProps) {
    const [search, setSearch] = useState<string>('');
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

    const treeData = useMemo(() => {
        if (!search) {
            setExpandedKeys([]);
            return cloneDeep(docList);
        }
        function filterDocs(docs: IDocInfo[]) {
            return docs.filter(doc => {
                if (doc.children) doc.children = filterDocs(doc.children);
                if (doc.title.includes(search)) {
                    if (!expandedKeys.includes(doc.key)) expandedKeys.push(doc.key);
                    return true;
                }
                return doc.children?.length;
            });
        }

        setExpandedKeys(expandedKeys);
        return filterDocs(cloneDeep(docList));
    }, [search, docList]);

    return <div className={useClassName("h-full w-1/4 bg-white shadow pt-2 overflow-auto", className)}>
        <Label label="搜索" className="h-6"><Input size="small" value={search} onChange={ev => setSearch(ev.target.value)} /></Label>
        <Tree key={search} className="h-[calc(100% - 2rem)] w-full p-2"
            itemHeight={24}
            treeData={treeData}
            selectedKeys={[docKey]}
            defaultExpandedKeys={expandedKeys}
            onSelect={(_, { selectedNodes: keys }) => setDocKey((keys[0]?.key as string) ?? null)}
            blockNode
            showLine
            autoExpandParent
        />
    </div>;
}