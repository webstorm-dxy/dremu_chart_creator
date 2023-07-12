import FractionInput from "@/components/fraction-input/fraction-input";
import { EditorContext } from "@/context/editor/editor";
import { setRecordState } from "@/hooks/set-record-state";
import { useStateContext } from "@/hooks/use-state-context";
import { ChartFlickEventDirections, ChartNoteEventType, IChartFlickNoteEvent, IChartHoldNoteEvent, IChartNoteEvents, IChartSustainEvent } from "@/interfaces/chart-data/chart-data.d";
import { Form, InputNumber, Select, SelectProps } from "antd";
import Fraction from "fraction.js";
import { ReactNode, useEffect, useMemo, useState } from "react";

export interface INoteTypeSelect extends SelectProps {
    label?: string;
    event: IChartNoteEvents;
}

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

    return <Form.Item label={props.label}>
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
                handler?.(...args);
                console.log(event);
                setRecordState(setEditorContext, prev => prev.editing.update = {});
                setUpdate({});
            }) as unknown as T;
        }

        function getFormRender(id: string, key: string, value: unknown): ReactNode {
            if (key === 'id') return <Form.Item key={id + key} label={key}>{value as string}</Form.Item>;

            if (value instanceof Fraction) return <Form.Item key={id + key} label={key}>
                <FractionInput value={value} onChange={onChangeHandler(val => event[key] = val)} />
            </Form.Item>;

            if (value instanceof Array) return <Form.Item key={id + key} label={key}>{
                value.length <= 3
                    ? value.map((val, i) => getFormRender(id + key, i === 0 ? 'x' : i === 1 ? 'y' : 'z', val))
                    : value.map((val, i) => getFormRender(id + key, i.toString(), val))
            }</Form.Item>;

            if (type === 'notes' && key === 'type') return <NoteTypeSelect key={id + key} label={key} event={event as IChartNoteEvents} onChange={onChangeHandler()} value={value} />;

            if (key === 'ease') return <Form.Item key={id + key} label={key}>
                <InputNumber min={0} max={30} value={Number(value) || 0} onChange={onChangeHandler(val => event[key] = Number(val))} />
            </Form.Item>;

            if (typeof value === 'number') return <Form.Item key={id + key} label={key}>
                <InputNumber value={Number(value) || 0} onChange={onChangeHandler(val => event[key] = Number(val))} />
            </Form.Item>;
        }

        return Object.keys(event).sort().map<ReactNode>(key => {
            const value = event[key];

            return getFormRender(event.id, key, value);
        });
    }, [id, update]);

    return <Form className="w-full" layout="vertical" labelWrap>
        {formItems}
    </Form>;
}