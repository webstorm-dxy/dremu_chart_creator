import { ChartMoveEventArgs } from "@interfaces/chart-data/event/move.d";
import Ease from "@scripts/utils/ease";
import { Vec2 } from "@scripts/utils/vec/vec";
import {  ChartSustainEvent } from "./event";

export class ChartMoveEvent extends ChartSustainEvent {
    from: Vec2;
    to: Vec2;
    ease: Ease;

    constructor(args: ChartMoveEventArgs) {
        super(args);
        this.from = args.from;
        this.to = args.to;
        this.ease = args.ease;
    }
}