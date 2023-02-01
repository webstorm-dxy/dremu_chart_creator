import Fraction from "fraction.js";
import { ChartEventArgs } from "../event";


export interface ChartNoteEventArgs extends ChartEventArgs{
    flag?: number;
    type: number;
    duration?: Fraction;
}