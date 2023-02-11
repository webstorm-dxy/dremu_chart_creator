import type Fraction from "fraction.js";

export interface ChartEventArgs{
    time: Fraction;
}

export interface ChartSustainEventArgs extends ChartEventArgs{
    duration: Fraction;
}