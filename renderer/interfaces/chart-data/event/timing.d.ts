import {ChartEventArgs } from "./event.d";

export interface ChartTimingEventArgs extends ChartEventArgs{
    speedRatio: number;
}