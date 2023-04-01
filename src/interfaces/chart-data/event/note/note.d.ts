import { ChartEventArgs } from "../event";


export enum NoteTypes {
    Tap,
    Hold,
    Drag,
    Flick
}

export interface ChartNoteEventArgs extends ChartEventArgs{
    flag?: number;
    type: NoteTypes;
}