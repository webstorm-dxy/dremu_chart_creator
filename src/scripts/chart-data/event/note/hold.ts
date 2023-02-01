import { ChartHoldNoteEventArgs } from "@interfaces/chart-data/event/note/hold";
import Fraction from "fraction.js";
import { ChartNoteEvent } from "./note";

export class ChartHoldNoteEvent extends ChartNoteEvent {
    duration: Fraction;

    constructor(args: ChartHoldNoteEventArgs) {
        super(args);
    }
}