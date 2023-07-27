import { ChartEventArgs } from "../event";


export enum NoteTypes {
    Tap,
    Hold,
    Darg,
    Flick
}

export interface ChartNoteEventArgs extends ChartEventArgs{
    flag?: number;
    type: NoteTypes;
}