import Bpm from "@/scripts/chart-data/bpm/bpm";
import Fraction from "fraction.js";

export interface ChartDataArgs{
    meta: Omit<Meta, 'version'|'id'> & Pick<Partial<Meta>, 'id'>;
    data: Data;
}

export interface Meta{
    name: string;
    version: number;
    id: Readonly<string>;
    bpm: Bpm;
    /** @type {number} ms */
    offset: number;
}

export interface IChartEvent {
    time: Fraction;
}

export interface IChartSustainEvent extends IChartEvent {
    endTime: Fraction;
}

export interface IChartEaseEvent extends IChartEvent {
    ease: Int;
}

export interface IChartChangeEvent<T> extends IChartEvent {
    from: T;
    to: T;
}

export enum ChartNoteEventType {
    Tap,
    Hold,
    Drag,
    Flick
}
export interface IChartNoteEvent extends IChartEvent {
    flag: number;
    type: ChartNoteEventType;
}

export interface IChartTapNoteEvent extends IChartNoteEvent {
    type: ChartNoteEventType.Tap;
}

export interface IChartHoldNoteEvent extends IChartNoteEvent, IChartSustainEvent {
    type: ChartNoteEventType.Hold;
}

export interface IChartDargNoteEvent extends IChartNoteEvent {
    type: ChartNoteEventType.Drag;
}


export enum ChartFlickEventDirections {
    Up,
    UpperRight,
    Right,
    LowerRight,
    Down,
    LowerLeft,
    Left,
    UpperLeft,
} 

export interface IChartFlickNoteEvent extends IChartNoteEvent {
    type: ChartNoteEventType.Flick;
    direction: ChartFlickEventDirections;
}

export type IChartNoteEvents = IChartTapNoteEvent|IChartHoldNoteEvent|IChartDargNoteEvent|IChartFlickNoteEvent;


export interface IChartDotEvent extends IChartEaseEvent {
    position: number;
    move: null;
    alpha: null;
}

export interface IChartAlphaEvent extends IChartSustainEvent, IChartEaseEvent, IChartChangeEvent<number> { }

export interface IChartMoveEvent extends IChartSustainEvent, IChartEaseEvent, IChartChangeEvent<Vec2> { }

export interface IChartTimingEvent extends IChartEvent {
    speedRatio: number;
}

export interface IChartRotateEvent extends IChartSustainEvent, IChartEaseEvent, IChartChangeEvent<number> {}

export enum IChartThemes {
    DEFAULT
}

export interface IChartThemeEvent extends IChartSustainEvent, IChartChangeEvent<IChartThemes> {}

export interface IChartLine {
    id: Int;
    speed: number;
    start: Vec2;
    children: IChartLine[];
    description: string;
    notes: IChartNoteEvents[];
    dots: IChartDotEvent[];
    alphas: IChartAlphaEvent[];
    moves: IChartMoveEvent[];
    timings: IChartTimingEvent[];
    rotates: IChartRotateEvent[];
}

export interface Data{
    lines: [IChartLine, ...IChartLine[]];
    themes: [IChartThemeEvent, ...IChartThemeEvent[]]; 
}

export type Beat = Fraction;

export type ChartTypes = 'aec'|'json';