import { ChartHoldNoteEventArgs } from "@interfaces/chart-data/event/note/hold.d";
import { ChartNoteEvent } from "./note";
import { SustainEvent } from "../event";
import Fraction from "fraction.js";
import { NoteTypes } from "@/interfaces/chart-data/event/note/note.d";


@SustainEvent
export class ChartHoldNoteEvent extends ChartNoteEvent {
    type: Readonly<NoteTypes.Hold>;
    
    // @SustainEvent
    endTime: Fraction;

    constructor(args: ChartHoldNoteEventArgs) {
        super({...args, type: NoteTypes.Hold});
    }
}