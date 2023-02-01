import Fraction from "fraction.js";
import { ChartNoteEventArgs } from "./note";

export interface ChartHoldNoteEventArgs extends ChartNoteEventArgs{
    duration: Fraction;
}