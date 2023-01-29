import { ChartNoteEventArgs } from "@interfaces/chart-data/event/note/note";
import { ChartNoteEvent } from "./note";

export class ChartTapNoteEvent extends ChartNoteEvent {
    type: Readonly<0>;

    constructor(args: ChartNoteEventArgs) {
        super({...args, type: 0});
    }
}