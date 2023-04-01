import { ChartNoteEventArgs } from "./note";
import { ChartSustainEventArgs } from "../event";

export interface ChartHoldNoteEventArgs extends ChartNoteEventArgs extends ChartSustainEventArgs{
}