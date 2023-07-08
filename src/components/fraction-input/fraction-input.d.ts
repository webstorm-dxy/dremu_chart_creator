import { GroupProps } from "antd/es/input";
import Fraction from "fraction.js";

export interface FractionInputProps extends GroupProps {
    value?: Fraction;
    onChange?: (value: Fraction) => void;
}