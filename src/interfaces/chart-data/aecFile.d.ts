import ChartData from "@scripts/chart-data/chart-data";
import { ChartLineArgs } from "./line";
import { ChartThemeEventArgs } from "./event/theme";

export type ChartAecFile = {
    meta: ChartData['meta'],
    data: {
        lines: [ChartLineArgs, ...ChartLineArgs[]],
        themes: [ChartThemeEventArgs, ...ChartThemeEventArgs[]]
    },
};
