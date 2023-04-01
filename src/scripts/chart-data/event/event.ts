import { ChartEventArgs, ChartSustainEventArgs } from "@interfaces/chart-data/event/event";
import Fraction from 'fraction.js';
import { Class } from '@interfaces/global-type';


export class ChartEvent {
    time: Fraction;

    constructor({ time }: ChartEventArgs) {
        this.time = new Fraction(time);
    }
}

export function SustainEvent<T extends Class>(target: T) {
    class SustainEvent extends (target as unknown as Class) {
        endTime: Fraction;

        constructor(args: ChartSustainEventArgs) {
            super(args);
            this.endTime = new Fraction(args.endTime || args.time?.add(2) || 2);
        }
    }
    return SustainEvent as (typeof SustainEvent&T);
}
