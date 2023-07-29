import { useSetState, useUpdateEffect } from "ahooks";
import { InputNumber, Space } from "antd";
import Fraction from "fraction.js";
import { useEffect } from "react";

export interface FractionInputProps {
    value: Fraction;
    onChange?: (value: Fraction) => void;
    onInput?: (value: Fraction) => void;
}

export function getFraction(argNum: number, argDen: number, argInt: number = 0): Fraction {
    function toInt(num: number, times: number = 0): [number, number] {
        if (!(num % 1)) return [num, times];
        return toInt(num * 10, times + 1);
    }

    const num = toInt(argInt * argDen + argNum);
    const den = toInt(argDen);

    if (num[1] > den[1]) den[0] *= 10 ** num[1] - den[1];
    if (num[0] < den[1]) num[0] *= 10 ** den[1] - num[0];

    return new Fraction(num[0], den[0]);
}

export default function FractionInput(props: FractionInputProps) {
    const { onChange, onInput } = props;

    const [focuses, setFocuses] = useSetState<Record<'int' | 'num' | 'den', boolean>>({ int: false, num: false, den: false });
    const [value, setValue] = useSetState<Record<'int' | 'num' | 'den', number>>({ int: 0, num: 0, den: 1 });

    useEffect(() => {
        if (focuses.int || focuses.num || focuses.den) return;
        const { value = new Fraction(0) } = props;
        const { n, s, d } = value;
        const int = Math.floor(value.valueOf());
        setValue({
            int,
            num: n * s - int * d,
            den: d
        });
    }, [props.value.valueOf()]);

    useUpdateEffect(() => {
        if (!value.den || (!focuses.int && !focuses.num && !focuses.den)) return;

        const { int = 0, num = 0, den = 1 } = value;
        onInput?.(getFraction(num, den || 1, int));
    }, [value.int, value.num, value.den]);

    useUpdateEffect(() => {
        if (focuses.int || focuses.num || focuses.den) return;

        const { int = 0, num = 0, den = 1 } = value;
        onChange?.(getFraction(num, den || 1, int));
    }, [focuses.int, focuses.num, focuses.den]);

    return <Space>
        <InputNumber className="w-14" value={value.int}
            onFocus={() => setFocuses({ int: true })}
            onBlur={() => setFocuses({ int: false })}
            onChange={val => setValue({ int: val || 0 })}
        />
        <label>:</label>
        <InputNumber className="w-14" value={value.num}
            onFocus={() => setFocuses({ num: true })}
            onBlur={() => setFocuses({ num: false })}
            onChange={val => setValue({ num: val || 0 })}
        />
        <label>/</label>
        <InputNumber className="w-14" value={value.den}
            onFocus={() => setFocuses({ den: true })}
            onBlur={() => {
                setFocuses({ den: false }); 
                setValue(prev => {
                    return { den: prev.den || 1 };
                });
            }}
            onChange={val => setValue({ den: val })}
        />
    </Space>;
}