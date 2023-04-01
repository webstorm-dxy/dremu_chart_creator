import { ChartNoteEventArgs, NoteTypes } from "@interfaces/chart-data/event/note/note.d";
import { ChartNoteEvent } from "./note";

export class ChartDragNoteEvent extends ChartNoteEvent {
    type: Readonly<NoteTypes.Drag>;

    constructor(args: ChartNoteEventArgs) {
        super({...args, type: NoteTypes.Drag});
    }
}