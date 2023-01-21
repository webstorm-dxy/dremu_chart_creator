import type Fraction from "fraction.js";

export interface ChartEventArgs{
    time: Fraction;
    lineId: number;
}

export interface ChartSustainEventArgs extends ChartEventArgs{
    duration: Fraction;
}