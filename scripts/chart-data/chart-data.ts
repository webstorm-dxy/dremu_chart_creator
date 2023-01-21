import type { ChartDataArgs, Data, Meta } from "@interfaces/chart-data/chart-data";



export default class ChartData{
    private meta: Meta;
    data: Readonly<Data>;

    constructor({meta, data}: ChartDataArgs) {
        this.meta = meta;
        this.data = data;
    }
    setMeta<K extends keyof ChartData['meta']>(key: K, value: ChartData['meta'][K]): ChartData['meta'][K] {
        this.meta[key] = value;
        return this.meta[key];
    }
    getMeta<K extends keyof ChartData['meta']>(key: K): ChartData['meta'][K] {
        return this.meta[key];
    }
}