import { ChartMoveEventArgs, IMove, MoveTypes } from "@interfaces/chart-data/event/move.d";
import Ease from "@scripts/utils/ease";
import { ChartEvent, SustainEvent } from "./event";
import Fraction from "fraction.js";
import { ChartMoveXEvent } from "./move-x";
import { ChartMoveYEvent } from "./move-y";


@SustainEvent
export class ChartMoveEvent extends ChartEvent {
    from: IMove;
    to: IMove;
    ease: Ease;
    
    // @SustainEvent
    endTime: Fraction;

    constructor(args: ChartMoveEventArgs) {
        super(args);
        this.from = args.from;
        this.to = args.to;
        this.ease = args.ease;
    }
}