import type { ChartDataArgs, Data, Meta } from "@interfaces/chart-data/chart-data";



export default class ChartData{
    /**
     * @description 谱面数据的类
     */
    private meta: Meta;
    data: Readonly<Data>;

    constructor({meta, data}: ChartDataArgs) {
        this.meta = meta;
        this.data = data;
    }
    setMeta<K extends keyof Meta>(key: K, value: Meta[K]): Meta[K] {
        this.meta[key] = value;
        return this.meta[key];
    }
    getMeta<K extends keyof Meta>(key: K): Meta[K] {
        return this.meta[key];
    }
}