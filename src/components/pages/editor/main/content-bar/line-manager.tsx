import Icon from "@/components/icon/icon";
import { EditorContext } from "@/context/editor/editor";
import { setRecordState } from "@/hooks/set-record-state";
import { useStateContext } from "@/hooks/use-state-context";
import { IChartLine } from "@/interfaces/chart-data/chart-data";
import { createLine } from "@/scripts/chart-data/chart-data";
import { Button, Form, Input, InputNumber, Popconfirm, Popover, Tree, TreeProps, Typography, message } from "antd";
import { throttle } from "lodash";
import { useState } from "react";

function toTreeData(lines: IChartLine[], editing: Int | null): TreeProps['treeData'] {
    if (!lines) return [];
    return lines.map(line => {
        const isEditing = line.id === editing;
        return {
            title: <span className={isEditing ? "text-green-500 font-medium" : ''}>line {line.id}<Typography.Text className="text-sm ml-2" type='secondary' ellipsis={{ tooltip: line.description }}>{line.description}</Typography.Text></span>,
            key: line.id,
            children: toTreeData(line.children, editing),
            icon: isEditing && <Icon className="text-green-500 ml-0 mr-0" icon="check" />,
        };
    });
}



export default function LineManager() {
    const [editorContext, setEditorContext] = useStateContext(EditorContext);
    const { chart } = editorContext;
    const [selectedLine, setSelectedLine] = useState<IChartLine | null>(null);

    const lineTreeData = toTreeData(chart?.data.lines, editorContext.editing.line);

    function setEditingLine(id: Int) {
        if (typeof id !== 'number') return message.warning('错误的line id. id: ' + id);
        setRecordState(setEditorContext, prev => prev.editing.line = id);
    }

    const onRightClickHandler: TreeProps['onRightClick'] = (ev) => setEditingLine(ev.node.key as number);

    const onDropHandler: TreeProps['onDrop'] = (info) => {
        const { dragNode, node, dropPosition } = info;
        const dragId = dragNode.key as number;
        const id = node.key as number;
        if (dragId === id) return;
        console.log(info);
        setRecordState(setEditorContext, prev => {
            const chart = prev.chart;
            const moveLine = chart.getLine(dragId);

            // 移除旧线
            chart.removeLine(dragId);

            //添加线
            const targetLine = chart.getLine(id);
            if (dropPosition === -1) {
                if (chart.data.lines.includes(targetLine))
                    chart.data.lines.push(moveLine);
                else
                    chart.getLine(line => line.children.includes(targetLine)).children.push(moveLine);
            } else
                targetLine.children.push(moveLine);
        });
    };

    const onSelectHandler = (keys) => {
        setSelectedLine(chart.getLine(keys[0]));
    };

    const addLineHandler = throttle(() => {
        setRecordState(setEditorContext, prev => {
            prev.chart.addLine(selectedLine);
        });
    }, 500);

    function EditLineForm({ line }: { line: IChartLine }) {
        const set = (setAction: (prev: IChartLine) => void) => setRecordState(setEditorContext, prevState => setAction(prevState.chart.getLine(line.id)));

        return line && <Form size="small">
            <Form.Item label="ID">{line.id}</Form.Item>
            <Form.Item label="初始流速">
                <InputNumber value={line.speed} onChange={val => set(prev => prev.speed = val)} />
            </Form.Item>
            <Form.Item label="初始坐标 (相对父线)">
                <Form.Item label="X">
                    <InputNumber value={line.start[0]} onChange={val => set(prev => prev.start[0] = val)} />
                </Form.Item>
                <Form.Item label="Y">
                    <InputNumber value={line.start[1]} onChange={val => set(prev => prev.start[1] = val)} />
                </Form.Item>
            </Form.Item>
            <Form.Item label="描述">
                <Input value={line.description} onChange={ev => set(prev => prev.description = ev.target.value)} />
            </Form.Item>
        </Form>;
    }

    return <div>
        <Button.Group className="mb-4">
            <Popconfirm title="添加" destroyTooltipOnHide onConfirm={addLineHandler}>
                <Button>添加</Button>
            </Popconfirm>
            <Popover trigger='click' title="编辑" destroyTooltipOnHide content={<EditLineForm line={selectedLine} />}>
                <Button>编辑</Button>
            </Popover>
        </Button.Group>
        {/* <Input></Input> */}
        <Tree treeData={lineTreeData}
            showLine
            showIcon
            blockNode
            autoExpandParent
            onSelect={onSelectHandler}
            onRightClick={onRightClickHandler}
            draggable={{ icon: false }}
            onDrop={onDropHandler}
        />
    </div>;
}