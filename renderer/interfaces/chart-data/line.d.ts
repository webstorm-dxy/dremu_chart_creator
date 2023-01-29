import { Int } from "@interfaces/global-type";

export interface ChartLineArgs{
    id: Int;
    speed: number;
    start: Vec2;
    notes?: ChartNoteEvent[];
    dots?: ChartDotEvent[];
    moves?: ChartMoveEvent[];
    timings?: ChartTimingEvent[];
    rotates?: ChartRotateEvent[];
}