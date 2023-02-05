import { ChartColorEvent } from "@scripts/chart-data/event/color";
import { ChartDotEvent } from "@scripts/chart-data/event/dot";
import { ChartMoveEvent } from "@scripts/chart-data/event/move";
import { ChartNoteEvent } from "@scripts/chart-data/event/note/note";
import { ChartRotateEvent } from "@scripts/chart-data/event/rotate";
import { ChartTimingEvent } from "@scripts/chart-data/event/timing";

export type LineEvents = ChartColorEvent|ChartDotEvent|ChartMoveEvent|ChartRotateEvent|ChartTimingEvent|ChartNoteEvent;