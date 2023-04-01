import { ChartRotateEventArgs } from "@interfaces/chart-data/event/rotate.d";
import Ease from "@scripts/utils/ease";
import {  ChartEvent, SustainEvent } from "./event";
import Fraction from "fraction.js";


@SustainEvent
export class ChartRotateEvent extends ChartEvent {
    from: number;
    to: number;
    ease: Ease;
    
    // @SustainEvent
    endTime: Fraction;

    constructor(args: ChartRotateEventArgs) {
        super(args);
        this.from = args.from;
        this.to = args.to;
        this.ease = args.ease || new Ease(0);
    }
}
