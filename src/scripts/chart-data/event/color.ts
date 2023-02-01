import { ChartColorEventArgs } from "@interfaces/chart-data/event/color.d";
import Ease from "@scripts/utils/ease";
import { Vec4 } from "@scripts/utils/vec/vec";
import {  ChartSustainEvent } from "./event";

export class ChartColorEvent extends ChartSustainEvent {
    from: Vec4;
    to: Vec4;
    ease: Ease;

    constructor(args: ChartColorEventArgs) {
        super(args);
        this.from = args.from;
        this.to = args.to;
        this.ease = args.ease;
    }
}