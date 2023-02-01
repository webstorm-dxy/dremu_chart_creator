import {ChartEventArgs } from "./event";

export interface ChartTimingEventArgs extends ChartEventArgs{
    speedRatio: number;
}