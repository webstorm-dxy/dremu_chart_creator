import { ChartTimingEventArgs } from "@interfaces/chart-data/event/timing.d";
import { ChartEvent } from "./event";

export class ChartTimingEvent extends ChartEvent {
    speedRatio: number;

    constructor(args: ChartTimingEventArgs) {
        super(args);
        this.speedRatio = args.speedRatio;
    }
}