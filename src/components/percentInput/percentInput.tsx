import { InputNumber, InputNumberProps } from "antd";

export type IPercentInputProps = InputNumberProps;

export default function PercentInput(props: IPercentInputProps) {
    return <InputNumber
        step={0.1}
        {...props}
        formatter={v => Number(v) * 100 + '%'}
        parser={v => Number(v.slice(0, -1)) / 100}
    />;
}