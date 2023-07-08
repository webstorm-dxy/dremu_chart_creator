import Bpm from "@/scripts/chart-data/bpm/bpm";
import { Button, Form, InputNumber, Popconfirm, Popover, Radio, Space } from "antd";
import { useState } from "react";
import FractionInput from "../fraction-input/fraction-input";
import Fraction from "fraction.js";
import { useSetState } from "ahooks";
import { IBpm } from "@/interfaces/chart-data/bpm";

interface IBPMEditorProps {
    bpm: Bpm;
    onChange?: (bpm: Bpm) => void;
}

function AddBPMForm({ bpm, setOpen }: { bpm: Bpm, setOpen: Function }) {
    const [bpmInfo, setBpmInfo] = useSetState<IBpm>({bpm: 120, beat: new Fraction(0)});

    const submitHandler = () => {
        bpm.addBpm(bpmInfo);
        setOpen({add: false});
    };

    return <Form onFinish={submitHandler}>
        <Form.Item name="bpm" label='BPM' required
            rules={[{type: 'number', min: 1, max: 1024, message: '数值不合法'}]}>
            <InputNumber defaultValue={120} onChange={v => setBpmInfo({bpm: v || 120})}/>
        </Form.Item>
        <Form.Item name="beat" label='开始拍子' required>
            <FractionInput onChange={v => setBpmInfo({beat: v})}/>
        </Form.Item>

        <Button type="primary" htmlType="submit">确定</Button>
    </Form >;
}

export default function BPMEditor({ bpm, onChange }: IBPMEditorProps) {
    const [selected, setSelected] = useState();
    const [open, setOpen] = useSetState({add: false, edit: false});

    return <Form className="overflow-auto">
        <Form.Item label="操作">
            <Button.Group>
                <Popover title="添加" open={open.add} content={<AddBPMForm bpm={bpm} setOpen={setOpen}/>} onOpenChange={newOpen => setOpen({add: newOpen})} destroyTooltipOnHide trigger='click'>
                    <Button>添加</Button>
                </Popover>
                <Popover title="编辑" open={open.edit} content onOpenChange={newOpen => setOpen({edit: newOpen})} destroyTooltipOnHide trigger='click'>
                    <Button>编辑</Button>
                </Popover>
                <Popconfirm title="删除" destroyTooltipOnHide trigger='click'>
                    <Button>删除</Button>
                </Popconfirm>
            </Button.Group>
        </Form.Item>

        <Form.Item name="bpm-list">
            <Radio.Group defaultValue={selected} onChange={ev => setSelected(ev.target.value)}>
                <Space direction="vertical">
                    {bpm?.map((v, i) => <Radio.Button key={i} value={i} className="w-full">
                        <Space>
                            <span>BPM: {v.bpm}</span>
                            <span>拍子: {v.beat.toFraction()}</span>
                            {/* <span>: {v.beat.toFraction()}</span> */}
                        </Space>
                    </Radio.Button>)}
                </Space>
            </Radio.Group>
        </Form.Item>
    </Form>;
}