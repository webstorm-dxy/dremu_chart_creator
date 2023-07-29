import { useSetState, useUpdateEffect } from "ahooks";
import { InputNumber, Space } from "antd";
import Fraction from "fraction.js";
import { useEffect } from "react";

export interface FractionInputProps {
    value: Fraction;
    onChange?: (value: Fraction) => void;
    onInput?: (value: Fraction) => void;
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
        if (!focuses.int && !focuses.num && !focuses.den) return;

        const { int = 0, num = 0, den = 1 } = value;
        onInput?.(new Fraction(int * den + num, den || 1));
    }, [value.int, value.num, value.den]);

    useUpdateEffect(() => {
        if (focuses.int || focuses.num || focuses.den) return;

        const { int = 0, num = 0, den = 1 } = value;
        onChange?.(new Fraction(int * den + num, den || 1));
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
            onBlur={() => setFocuses({ den: false })}
            onChange={val => setValue(prev => {
                return { den: val || (prev.den > val ? -1 : 1) };
            })}
        />
    </Space>;
}