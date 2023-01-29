import { ChartEventArgs, ChartSustainEventArgs } from "@interfaces/chart-data/event/event";
import Fraction from 'fraction.js';


export class ChartEvent{
    time: Fraction;
    lineId: number;

    constructor({time, lineId}: ChartEventArgs) {
        this.time = time;
        this.lineId = lineId;
    }
}

export class ChartSustainEvent extends ChartEvent{
    duration: Fraction;

    constructor(args: ChartSustainEventArgs) {
        super(args);
        this.duration = args.duration;
    }
}