import FractionInput from "@/components/fraction-input/fraction-input";
import { EditorContext } from "@/context/editor/editor";
import { setRecordState } from "@/hooks/set-record-state";
import { useStateContext } from "@/hooks/use-state-context";
import { ChartFlickEventDirections, ChartNoteEventType, IChartFlickNoteEvent, IChartHoldNoteEvent, IChartNoteEvents, IChartSustainEvent } from "@/interfaces/chart-data/chart-data.d";
import { Form, InputNumber, Select, SelectProps, TooltipProps } from "antd";
import Fraction from "fraction.js";
import { ReactNode, useEffect, useMemo, useState } from "react";

export interface INoteTypeSelect extends SelectProps {
    label?: string;
    tooltip?: TooltipProps;
    event: IChartNoteEvents;
}

const attrKeyIndex = ['id', 'time', 'endTime', 'type', 'flag', 'position', 'speedRadio', 'from', 'to', 'ease'];
const labelOfKey: Record<string|number, string> = {
    id: 'ID',
    time: '起始时间',
    endTime: '结束时间',
    type: '类型',
    position: '位置',
    speedRadio: '流速',
    from: '初始值',
    to: '结束值',
    ease: '缓动'
};
const helpOfKey: Record<string|number, string> = {position: '相对于线锚点的X坐标偏移量'};

export function NoteTypeSelect(props: INoteTypeSelect) {
    const { event, onChange } = props;

    const noteTypeOptions: SelectProps['options'] = useMemo(() => {
        const res = [];
        for (const key of Object.keys(ChartNoteEventType)) {
            if (typeof ChartNoteEventType[key] !== 'number') continue;

            res.push({
                title: key,
                value: ChartNoteEventType[key],
                label: key,
            });
        }
        return res;
    }, [ChartNoteEventType]);

    return <Form.Item required label={props.label} tooltip={props.tooltip}>
        <Select options={noteTypeOptions} optionLabelProp="label" {...props} onChange={(val, options) => {
            switch (val) {
                case ChartNoteEventType.Tap:
                    (event as unknown as IChartHoldNoteEvent).endTime = undefined;
                    (event as unknown as IChartFlickNoteEvent).direction = undefined;
                    break;
                case ChartNoteEventType.Darg:
                    (event as unknown as IChartHoldNoteEvent).endTime = undefined;
                    (event as unknown as IChartFlickNoteEvent).direction = undefined;
                    break;
                case ChartNoteEventType.Hold:
                    (event as unknown as IChartHoldNoteEvent).endTime ||= new Fraction(event.time);
                    (event as unknown as IChartFlickNoteEvent).direction = undefined;
                    break;
                case ChartNoteEventType.Flick:
                    (event as unknown as IChartFlickNoteEvent).direction ||= ChartFlickEventDirections.Up;
                    (event as unknown as IChartHoldNoteEvent).endTime = undefined;
                    break;
            }
            event.type = val;
            onChange?.(val, options);
        }} />
    </Form.Item>;
}

export default function AttrEditor() {
    const [editorContext, setEditorContext] = useStateContext(EditorContext);
    const [update, setUpdate] = useState({});
    const id = editorContext.editing.selected.values().next().value;
    const ev = useMemo(() => editorContext.chart?.getEventById(id).event, [id]);

    useEffect(() => {
        setUpdate({});
    }, [ev?.time, (ev as IChartSustainEvent)?.endTime]);

    const formItems = useMemo<ReactNode>(() => {
        const chart = editorContext.chart;
        const selected = editorContext.editing.selected;
        if (selected.size !== 1) return null;

        const { event, type } = chart?.getEventById(id);
        if (!event || !type) return null;

        function onChangeHandler<T extends Function>(handler?: T): T {
            return ((...args: unknown[]) => {
                if(!args[0]) return;
                handler?.(...args);
                console.log(event);
                setRecordState(setEditorContext, prev => prev.editing.update = {});
                setUpdate({});
            }) as unknown as T;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function getFormRender(data: Record<string | number | symbol, any>, key: string|number, options: { id?: string, label?: string, description?: string, value?: unknown } = {}): ReactNode {
            const value = options.value || data[key];
            const label = options.label || key.toString();
            const id = options.id || key;
            const tooltip = options.description && {title: options.description};
            if (key === 'id') return <Form.Item required key={id} label={label} tooltip={tooltip}>{value as string}</Form.Item>;

            if (value instanceof Fraction) return <Form.Item required key={id} label={label} tooltip={tooltip}>
                <FractionInput value={value} onChange={onChangeHandler(val => { if(key !== 'endTime' || val.compare(data.time) >= 0) data[key] = val; })} />
            </Form.Item>;

            if (value instanceof Array) return <Form.Item required key={id} label={label} tooltip={tooltip}>{
                value.length <= 3
                    ? value.map((val, i) => getFormRender(data[key], i, {id: `${id} ${i}`, label: i === 0 ? 'x' : i === 1 ? 'y' : 'z', value:val}))
                    : value.map((val, i) => getFormRender(data[key], i, {id: `${id} ${i}`, label: i.toString(), value:val}))
            }</Form.Item>;

            if (type === 'notes' && key === 'type') return <NoteTypeSelect key={id} label={label} tooltip={tooltip} event={data as IChartNoteEvents} onChange={onChangeHandler()} value={value} />;

            if (key === 'ease') return <Form.Item required key={id} label={label} tooltip={tooltip}>
                <InputNumber min={0} max={30} value={Number(value) || 0} onChange={onChangeHandler(val => data[key] = Number(val))} />
            </Form.Item>;

            if (typeof value === 'number') return <Form.Item required key={id} label={label} tooltip={tooltip}>
                <InputNumber value={Number(value) || 0} onChange={onChangeHandler(val => data[key] = Number(val))} />
            </Form.Item>;
        }

        return Object.keys(event).sort((a, b) => Math.abs(attrKeyIndex.indexOf(a)) - Math.abs(attrKeyIndex.indexOf(b))).map<ReactNode>((key, i) => {
            return getFormRender(event, key, { id: `${event.id} ${key} ${i}`, label: labelOfKey[key], description: helpOfKey[key] });
        });
    }, [id, update]);

    return <Form className="w-full" layout="vertical" labelWrap>
        {formItems}
    </Form>;
}