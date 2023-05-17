import Bpm from "@/scripts/chart-data/bpm/bpm";
import ChartThemeEvent from "@/scripts/chart-data/event/theme";
import ChartLine from "@/scripts/chart-data/line";
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
}

export interface Data{
    lines: [ChartLine, ...ChartLine[]];
    themes: [ChartThemeEvent, ...ChartThemeEvent[]]; 
}

export type Beat = Fraction;

export type ChartTypes = 'aec'|'json';