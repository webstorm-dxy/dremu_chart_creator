import Label from "@/components/label/label";
import useClassName from "@/hooks/use-class-name";
import { ISetAction } from "@/hooks/use-state-context";
import { IDocInfo } from "@/pages/doc";
import { Input, Tree } from "antd";
import { cloneDeep } from "lodash";
import { useMemo, useState } from "react";

export interface IDocTreeProps {
    className?: string;
    docKey: string;
    docList: IDocInfo[];
    setDocKey: ISetAction<string>;
}

export default function DocTree({ className, docKey, docList, setDocKey }: IDocTreeProps) {
    const [search, setSearch] = useState<string>('');

    const treeData = useMemo(() => {
        function filterDocs(docs: IDocInfo[]) {
            const res = docs.map(doc => {
                if(doc.children) doc.children = filterDocs(doc.children);
                return doc.title.includes(search) || doc.children?.length ? doc : null;
            });
            return res.filter(v => v);
        }

        return filterDocs(cloneDeep(docList));
    }, [search, docList]);

    return <div className={useClassName("h-full w-1/4 bg-white shadow pt-2", className)}>
        <Label label="搜索"><Input size="small" value={search} onChange={ev => setSearch(ev.target.value)}/></Label>
        <Tree className="h-full w-full p-2"
            itemHeight={24}
            treeData={treeData}
            selectedKeys={[docKey]}
            onSelect={(_, {selectedNodes: keys}) => setDocKey(keys[0]?.key ?? null)}
            filterTreeNode={(node => node.title.includes(search))}
            blockNode
            showLine
            autoExpandParent
        />
    </div>;
}