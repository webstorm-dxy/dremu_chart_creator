import { Input, InputNumber, Space } from "antd";
import Fraction from "fraction.js";
import { useEffect, useState } from "react";
import { FractionInputProps } from './fraction-input.d';


export function FractionInputForm(props: FractionInputProps) {
    const { value: fraction = new Fraction(0), onChange } = props;
    const value = fraction.simplify();

    const [int, setInt] = useState<number>(Math.floor(value.valueOf()));
    const [numerator, setNumerator] = useState<number>(value.n * value.s - int * value.d);
    const [denominator, setDenominator] = useState<number>(value.d);

    useEffect(() => {
        if (numerator >= denominator) {
            setInt(int + Math.floor(numerator / denominator));
            setNumerator(numerator % denominator);
        }
        if (numerator < 0 || denominator < 0) {
            setInt(prev => 0 - prev);
            setNumerator(Math.abs(numerator));
            setDenominator(Math.abs(denominator));
        }
    }, [int, numerator, denominator]);

    function change(type: 'int' | 'numerator' | 'denominator', value: number) {
        function callback(int: number, numerator: number, denominator: number) {
            if (denominator === 0) return;
            setInt(int);
            setNumerator(numerator);
            setDenominator(denominator);

            if (onChange) onChange(new Fraction(int * denominator + numerator, denominator));
        }

        switch (type) {
            case 'int':
                callback(value, numerator, denominator);
                break;
            case 'numerator':
                callback(int, value, denominator);
                break;
            case 'denominator':
                callback(int, numerator, value);
                break;
        }
    }

    return <Input.Group className="max-w-full" {...props}>
        <Space align='center' size="small" wrap>
            <InputNumber className="w-14" value={int} onChange={v => { change('int', v); }} />
            <label>:</label>
            <InputNumber className="w-14" value={numerator} onChange={v => { change('numerator', v); }} />
            <label>/</label>
            <InputNumber className="w-14" value={denominator} onChange={v => { change('denominator', v); }} />
        </Space>
    </Input.Group>;
}

export default function FractionInput(props: FractionInputProps) {
    return <FractionInputForm {...props} key={props.value?.toFraction()}/>;
}