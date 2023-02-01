import { ChartNoteEventArgs } from "@interfaces/chart-data/event/note/note";
import { ChartNoteEvent } from "./note";

export class ChartDragNoteEvent extends ChartNoteEvent {
    type: Readonly<2>;

    constructor(args: ChartNoteEventArgs) {
        super({...args, type: 2});
    }
}