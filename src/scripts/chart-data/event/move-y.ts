import { ChartMoveYEventArgs } from "@interfaces/chart-data/event/move-y.d";
import { ChartMoveEvent } from "./move";


export class ChartMoveYEvent extends ChartMoveEvent {
    constructor(args: ChartMoveYEventArgs) {
        super(args);
    }
}