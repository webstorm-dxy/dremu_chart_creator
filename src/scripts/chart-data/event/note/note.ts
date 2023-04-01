import { ChartNoteEventArgs } from "@interfaces/chart-data/event/note/note.d";
import { ChartEvent } from "../event";

export class ChartNoteEvent extends ChartEvent {
    flag: number;
    type: Readonly<number>;
    
    protected constructor(args: ChartNoteEventArgs) {
        super(args);
        this.flag = args.flag ?? 15;
        this.type = args.type ?? -1;
    }
}