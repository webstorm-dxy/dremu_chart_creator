import { ChartMoveEventArgs, MoveTypes } from "@/interfaces/chart-data/event/move";
import { ChartMoveXEvent } from "./move-x";
import { ChartMoveYEvent } from "./move-y";

export function create<T extends ChartMoveEventArgs>(type: MoveTypes, args: T) {
    switch(type) {
        case MoveTypes.X: return new ChartMoveXEvent(args);
        case MoveTypes.Y: return new ChartMoveYEvent(args);
    }
}