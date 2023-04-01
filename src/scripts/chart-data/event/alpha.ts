import { ChartAlphaEventArgs, IAlpha } from "@interfaces/chart-data/event/alpha.d";
import Ease from "@scripts/utils/ease";
import { ChartEvent, SustainEvent } from "./event";
import Fraction from "fraction.js";


@SustainEvent
export class ChartAlphaEvent extends ChartEvent {
    from: IAlpha;
    to: IAlpha;
    ease: Ease;
    
    // @SustainEvent
    endTime: Fraction;

    constructor(args: ChartAlphaEventArgs) {
        super(args);
        this.from = args.from;
        this.to = args.to;
        this.ease = args.ease;
    }
}