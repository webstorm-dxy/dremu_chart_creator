import { ChartNoteEventArgs } from "./note";

export interface ChartFlickNoteEventArgs extends ChartNoteEventArgs {
    direction?: 0|1|2|3|4|5|6|7;
}