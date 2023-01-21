import { ChartNoteEventArgs } from "@interfaces/chart-data/event/note/note";
import Fraction from "fraction.js";
import { ChartSustainEvent } from "../event";

export class ChartNoteEvent extends ChartSustainEvent {
    flag: number;
    type: Readonly<number>;
    
    constructor(args: ChartNoteEventArgs) {
        super({duration: new Fraction(0), ...args});
        this.flag = args.flag ?? 15;
        this.type = args.type ?? -1;
    }
    
}