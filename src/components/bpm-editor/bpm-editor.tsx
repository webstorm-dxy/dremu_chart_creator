import Bpm, { IBpm } from "@/scripts/chart-data/bpm/bpm";
import { Button, Form, InputNumber, Popconfirm, Popover, Radio, Space } from "antd";
import { useEffect, useState } from "react";
import FractionInput from "../fraction-input/fraction-input";
import Fraction from "fraction.js";
import { useSetState } from "ahooks";

interface IBPMEditorProps {
    bpm: Bpm;
    onChange?: (bpm: Bpm) => void;
}

function AddBPMForm({ bpm, setOpen }: { bpm: Bpm, setOpen: Function; }) {
    const [bpmInfo, setBpmInfo] = useSetState<IBpm<Fraction>>({ bpm: 120, beat: new Fraction(0) });

    const submitHandler = () => {
        bpm.add(bpmInfo);
        setOpen({ add: false });
    };

    return <Form onFinish={submitHandler}>
        <Form.Item name="bpm" label='BPM' required initialValue={bpmInfo.bpm}>
            <InputNumber defaultValue={bpmInfo.bpm} onChange={v => setBpmInfo({ bpm: v ?? 120 })} />
        </Form.Item>
        <Form.Item name="beat" label='开始拍子' required initialValue={bpmInfo.beat}>
            <FractionInput value={bpmInfo.beat} onChange={v => setBpmInfo({ beat: v })} />
        </Form.Item>

        <Button type="primary" htmlType="submit">确定</Button>
    </Form >;
}

function EditBPMForm({ bpm, index, setOpen }: { bpm: Bpm, index: number, setOpen: Function; }) {
    const [bpmInfo, setBpmInfo] = useSetState<IBpm<Fraction>>({
        bpm: bpm.bpms[index].bpm ?? 120,
        beat: new Fraction(bpm.bpms[index].beat || 0)
    });

    const submitHandler = () => {
        bpm.set(index, bpmInfo);
        setOpen({ edit: false });
    };

    return <Form onFinish={submitHandler}>
        <Form.Item name="bpm" label='BPM' required initialValue={bpmInfo.bpm}>
            <InputNumber defaultValue={bpmInfo.bpm} onChange={v => setBpmInfo({ bpm: v ?? 120 })} />
        </Form.Item>
        <Form.Item name="beat" label='开始拍子' required initialValue={bpmInfo.beat}>
            <FractionInput value={bpmInfo.beat} onChange={v => setBpmInfo({ beat: v })} />
        </Form.Item>
        
        <Button type="primary" htmlType="submit">确定</Button>
    </Form >;
}

export default function BPMEditor({ bpm }: IBPMEditorProps) {
    const [selected, setSelected] = useState<number>(0);
    const [open, setOpen] = useSetState({ add: false, edit: false });

    useEffect(() => {
        if(!selected) setSelected(0);
    }, [selected]);

    return <Form className="overflow-auto">
        <Form.Item label="操作">
            <Button.Group>
                <Popover title="添加" open={open.add} content={<AddBPMForm bpm={bpm} setOpen={setOpen} />} onOpenChange={newOpen => setOpen({ add: newOpen })} destroyTooltipOnHide trigger='click'>
                    <Button>添加</Button>
                </Popover>
                <Popover title="编辑" open={open.edit} content={(!!selected || selected === 0) && <EditBPMForm bpm={bpm} index={selected} setOpen={setOpen} />} onOpenChange={newOpen => setOpen({ edit: newOpen })} destroyTooltipOnHide trigger='click'>
                    <Button disabled={(!selected && selected !== 0)} >编辑</Button>
                </Popover>
                <Popconfirm title="删除" disabled={(!selected && selected !== 0) || bpm?.bpms.length === 1} destroyTooltipOnHide trigger='click' onConfirm={() => { bpm.remove(selected); setSelected(null); }}>
                    <Button disabled={(!selected && selected !== 0) || bpm?.bpms.length === 1}>删除</Button>
                </Popconfirm>
            </Button.Group>
        </Form.Item>

        <Form.Item name="bpm-list">
            <Radio.Group value={selected} onChange={ev => setSelected(ev.target.value)}>
                <Space direction="vertical">
                    {bpm?.bpms.map((v, i) => <Radio.Button key={i} value={i} className="w-full">
                        <Space>
                            <span>BPM: {v.bpm}</span>
                            <span>拍子: {v.beat.toFraction()}</span>
                        </Space>
                    </Radio.Button>)}
                </Space>
            </Radio.Group>
        </Form.Item>
    </Form>;
}