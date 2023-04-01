import { ChartDotEventArgs } from "@interfaces/chart-data/event/dot.d";
import Ease from "@scripts/utils/ease";
import { ChartEvent } from "./event";

export class ChartDotEvent extends ChartEvent {
    position: number;
    ease: Ease;
    move: Readonly<null>;
    alpha: Readonly<null>;

    constructor(args: ChartDotEventArgs) {
        super(args);
        this.ease = args.ease;
        this.position = args.position;
        this.move = null;
        this.alpha = null;
    }
}