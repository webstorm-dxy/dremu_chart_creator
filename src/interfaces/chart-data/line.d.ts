import { ChartAlphaEvent } from "@/scripts/chart-data/event/alpha";
import { ChartDotEvent } from "@/scripts/chart-data/event/dot";
import { ChartMoveXEvent } from "@/scripts/chart-data/event/move-x";
import { ChartMoveYEvent } from "@/scripts/chart-data/event/move-y";
import { ChartNoteEvent } from "@/scripts/chart-data/event/note/note";
import { ChartRotateEvent } from "@/scripts/chart-data/event/rotate";
import { ChartTimingEvent } from "@/scripts/chart-data/event/timing";
import { Int } from "@interfaces/global-type";
import type ChartLine from "@scripts/chart-data/line";
import { ChartDotEventArgs } from "./event/dot";
import { ChartMoveXEventArgs } from "./event/move-x";
import { ChartMoveYEventArgs } from "./event/move-y";
import { ChartRotateEventArgs } from "./event/rotate";

export interface ChartLineArgs{
    id: Int;
    speed: number;
    start: Vec2;
    parent?: ChartLine|undefined;
    notes?: ChartNoteEvent[] | ChartNoteEventArgs[];
    dots?: ChartDotEvent[] | ChartDotEventArgs[];
    alphas?: ChartAlphaEvent[] | ChartAlphaEventArgs[];
    moveXs?: ChartMoveXEvent[] | ChartMoveXEventArgs[];
    moveYs?: ChartMoveYEvent[] | ChartMoveYEventArgs[];
    timings?: ChartTimingEvent[] | ChartTimingEventArgs[];
    rotates?: ChartRotateEvent[] | ChartRotateEventArgs[];
}