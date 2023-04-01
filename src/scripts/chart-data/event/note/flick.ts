import { ChartFlickNoteEventArgs } from "@interfaces/chart-data/event/note/flick.d";
import { ChartNoteEvent } from "./note";
import { NoteTypes } from "@/interfaces/chart-data/event/note/note.d";

export class ChartFlickNoteEvent extends ChartNoteEvent {
    type: Readonly<NoteTypes.Flick>;
    direction: 0|1|2|3|4|5|6|7;

    constructor(args: ChartFlickNoteEventArgs) {
        super({...args, type: NoteTypes.Flick});
        this.direction = args.direction ?? 0;
    }
}