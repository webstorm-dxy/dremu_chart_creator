import useClassName from "@/hooks/use-class-name";
import { ISetAction } from "@/hooks/use-state-context";
import { IDocInfo } from "@/pages/doc";
import { Tree } from "antd";

export interface IDocTreeProps {
    className?: string;
    docKey: string;
    docList: IDocInfo[];
    setDocKey: ISetAction<string>;
}

export default function DocTree({ className, docKey, docList, setDocKey }: IDocTreeProps) {

    return <div className={useClassName("h-full w-1/4 bg-white shadow", className)}>
        <Tree className="h-full w-full p-2"
            itemHeight={24}
            treeData={docList}
            selectedKeys={[docKey]}
            onSelect={(_, {selectedNodes: keys}) => setDocKey(keys[0]?.key ?? null)}
            blockNode
            showLine
            autoExpandParent
        />
    </div>;
}