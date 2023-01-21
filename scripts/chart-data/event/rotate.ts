import { ChartRotateEventArgs } from "@interfaces/chart-data/event/rotate.d";
import Ease from "@scripts/utils/ease";
import {  ChartSustainEvent } from "./event";

export class ChartRotateEvent extends ChartSustainEvent {
    from: number;
    to: number;
    ease: Ease;

    constructor(args: ChartRotateEventArgs) {
        super(args);
        this.from = args.from;
        this.to = args.to;
        this.ease = args.ease;
    }
}