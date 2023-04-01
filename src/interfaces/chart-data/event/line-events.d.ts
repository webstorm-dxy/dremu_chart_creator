import type { ChartAlphaEvent } from "@/scripts/chart-data/event/alpha";
import type { ChartDotEvent } from "@scripts/chart-data/event/dot";
import type { ChartMoveEvent } from "@scripts/chart-data/event/move";
import type { ChartNoteEvent } from "@scripts/chart-data/event/note/note";
import type { ChartRotateEvent } from "@scripts/chart-data/event/rotate";
import type { ChartTimingEvent } from "@scripts/chart-data/event/timing";
import { ChartAlphaEventArgs } from "./alpha";
import { ChartDotEventArgs } from "./dot";
import { ChartMoveEventArgs } from "./move";
import { ChartNoteEventArgs } from "./note/note";
import { ChartTimingEventArgs } from "./timing";
import { ChartRotateEventArgs } from "./rotate";

export type LineEvents = ChartAlphaEvent | ChartDotEvent | ChartMoveEvent
    | ChartRotateEvent | ChartTimingEvent | ChartNoteEvent;
export type LineEventArgs = ChartAlphaEventArgs | ChartDotEventArgs | ChartMoveEventArgs
    | ChartRotateEventArgs | ChartTimingEventArgs | ChartNoteEventArgs;