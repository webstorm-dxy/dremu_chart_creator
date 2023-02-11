import { ChartEventArgs, ChartSustainEventArgs } from "@interfaces/chart-data/event/event";
import Fraction from 'fraction.js';


export class ChartEvent{
    time: Fraction;

    constructor({time}: ChartEventArgs) {
        this.time = time;
    }
}

export class ChartSustainEvent extends ChartEvent{
    duration: Fraction;

    constructor(args: ChartSustainEventArgs) {
        super(args);
        this.duration = args.duration;
    }
}