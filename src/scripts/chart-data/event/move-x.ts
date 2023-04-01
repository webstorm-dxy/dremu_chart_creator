import { ChartMoveXEventArgs } from "@interfaces/chart-data/event/move-x.d";
import { ChartMoveEvent } from "./move";


export class ChartMoveXEvent extends ChartMoveEvent {
    constructor(args: ChartMoveXEventArgs) {
        super(args);
    }
}