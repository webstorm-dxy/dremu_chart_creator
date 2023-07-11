import Icon from "@/components/icon/icon";
import { EditorContext } from "@/context/editor/editor";
import { setRecordState } from "@/hooks/set-record-state";
import { useStateContext } from "@/hooks/use-state-context";
import { IChartLine } from "@/interfaces/chart-data/chart-data";
import { Tree, TreeProps, Typography, message } from "antd";

function toTreeData(lines: IChartLine[], editing: Int|null): TreeProps['treeData'] {
    if (!lines) return [];
    return lines.map(line => {
        const isEditing = line.id === editing;
        return {
            title: <span className={isEditing ? "text-green-500 font-medium" : ''}>line {line.id}<Typography.Text className="text-sm ml-2" type='secondary' ellipsis={{tooltip: line.description}}>{line.description}</Typography.Text></span>,
            key: line.id,
            children: toTreeData(line.children, editing),
            icon: isEditing && <Icon className="text-green-500 ml-0 mr-0" icon="check"/>
        };
    });
}

export default function LineManager() {
    const [editorContext, setEditorContext] = useStateContext(EditorContext);
    const { chart } = editorContext;

    const lineTreeData = toTreeData(chart?.data.lines, editorContext.editing.line);

    function setEditingLine(id: Int) {
        if (typeof id !== 'number') return message.warning('错误的line id. id: ' + id);
        setRecordState(setEditorContext, prev => prev.editing.line = id);
    }

    const onRightClickHandler: TreeProps['onRightClick'] = (ev) => setEditingLine(ev.node.key as number);

    return <div>
        {/* <Input></Input> */}
        <Tree treeData={lineTreeData}
            showLine
            showIcon
            blockNode
            onRightClick={onRightClickHandler}
        />
    </div>;
}