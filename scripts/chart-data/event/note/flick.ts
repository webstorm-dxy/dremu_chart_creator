import { ChartFlickNoteEventArgs } from "@interfaces/chart-data/event/note/flick";
import { ChartNoteEvent } from "./note";

export class ChartFlickNoteEvent extends ChartNoteEvent {
    type: Readonly<3>;
    direction: 0|1|2|3|4|5|6|7;

    constructor(args: ChartFlickNoteEventArgs) {
        super({...args, type: 3});
        this.direction = args.direction ?? 0;
    }
}