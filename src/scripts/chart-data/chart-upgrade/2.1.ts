import { ChartAecFile } from "@/interfaces/chart-data/aecFile";
import { IBpm } from "../bpm/bpm";
import Fraction from "fraction.js";

type IBpm2_0 = IBpm<Fraction>[];

export default (aecChart: ChartAecFile) => {
    const bpm = aecChart.meta.bpm;
    const oldBpm = (bpm as unknown as IBpm2_0);
    
    bpm.bpms = [];
    oldBpm.forEach((info, i) => {
        bpm.bpms[i] = info;
        oldBpm[i] = void 0;
    });

    aecChart.meta.bpm = bpm;

    aecChart.meta.version = 2.1;

    return aecChart;
};