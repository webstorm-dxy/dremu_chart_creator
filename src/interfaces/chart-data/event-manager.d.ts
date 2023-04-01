import type { ChartAlphaEvent } from "@/scripts/chart-data/event/alpha";
import type { ChartDotEvent } from "@scripts/chart-data/event/dot";
import type { ChartMoveEvent } from "@scripts/chart-data/event/move";
import type { ChartNoteEvent } from "@scripts/chart-data/event/note/note";
import type { ChartRotateEvent } from "@scripts/chart-data/event/rotate";
import type { ChartTimingEvent } from "@scripts/chart-data/event/timing";
import ChartThemeEvent from "@/scripts/chart-data/event/theme";
import { ChartAlphaEventArgs } from "./alpha";
import { ChartDotEventArgs } from "./dot";
import { ChartMoveEventArgs } from "./move";
import { ChartNoteEventArgs } from "./note/note";
import { ChartTimingEventArgs } from "./timing";
import { ChartRotateEventArgs } from "./rotate";
import { ChartThemeEventArgs } from "./event/theme";

export type IEvents = ChartAlphaEvent | ChartDotEvent | ChartMoveEvent
| ChartRotateEvent | ChartTimingEvent | ChartNoteEvent | ChartThemeEvent;
export type IEventArgs = ChartAlphaEventArgs | ChartDotEventArgs | ChartMoveEventArgs
| ChartRotateEventArgs | ChartTimingEventArgs | ChartNoteEventArgs | ChartThemeEventArgs;


export interface IDuringEvent<T extends IEvents> {
    event: T|null;
    index: number|null;
}