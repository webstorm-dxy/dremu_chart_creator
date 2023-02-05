import { Int } from "@interfaces/global-type";
import type ChartLine from "@scripts/chart-data/line";

export interface ChartLineArgs{
    id: Int;
    speed: number;
    start: Vec2;
    parent?: ChartLine|undefined;
    notes?: ChartNoteEvent[];
    dots?: ChartDotEvent[];
    moves?: ChartMoveEvent[];
    timings?: ChartTimingEvent[];
    rotates?: ChartRotateEvent[];
}