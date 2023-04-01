import { ChartNoteEventArgs, NoteTypes } from "@/interfaces/chart-data/event/note/note";
import { ChartDragNoteEvent } from "./drag";
import { ChartFlickNoteEvent } from "./flick";
import { ChartHoldNoteEvent } from "./hold";
import { ChartTapNoteEvent } from "./tap";

export function create<T extends ChartNoteEventArgs>(args: T) {
    switch (args.type) {
        case NoteTypes.Tap: return new ChartTapNoteEvent(args);
        case NoteTypes.Drag: return new ChartDragNoteEvent(args);
        case NoteTypes.Hold: return new ChartHoldNoteEvent(args);
        case NoteTypes.Flick: return new ChartFlickNoteEvent(args);
    }
}