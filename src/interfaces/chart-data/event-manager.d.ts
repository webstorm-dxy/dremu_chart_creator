import { IChartAlphaEvent, IChartDotEvent, IChartMoveEvent, IChartRotateEvent, IChartTimingEvent, IChartNoteEvent, IChartThemeEvent, IChartChangeEvent } from '@interfaces/chart-data/chart-data.d';

export type IEvents = IChartAlphaEvent | IChartDotEvent | IChartMoveEvent
    | IChartRotateEvent | IChartTimingEvent | IChartNoteEvent | IChartThemeEvent;


export interface IDuringEvent<T extends IChartChangeEvent> {
    event: T | null;
    index: number | null;
}