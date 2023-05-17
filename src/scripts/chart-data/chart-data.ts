import { ChartAecFile } from "@interfaces/chart-data/aecFile";
import type { ChartDataArgs, ChartTypes, Data, Meta } from "@interfaces/chart-data/chart-data";
import { createMd5 } from "@scripts/utils/crypto/md5";
import { saveAudio } from "@scripts/utils/fs/audio";
import ChartLine from "./line";
import ChartThemeEvent from "./event/theme";
import Fraction from "fraction.js";
import Bpm from "./bpm/bpm";



export default class ChartData{
    /**
     * @description 谱面数据的类
     */
    meta: Meta;
    data: Readonly<Data>;

    constructor({meta, data}: ChartDataArgs) {
        const id = meta.id ? meta.id : createMd5();
        this.meta = {...meta, version: ChartData.getVersion(), id} as ChartData['meta'];
        this.data = data;
    }
    setMeta<K extends keyof Meta>(key: K, value: Meta[K]): Meta[K] {
        this.meta[key] = value;
        return this.meta[key];
    }
    getMeta<K extends keyof Meta>(key: K): Meta[K] {
        return this.meta[key];
    }

    // version
    static getVersion(): number {
        return 2.0;
    }

    // id
    getId(): string {
        return this.meta.id;
    }

    // 导出方法
    exportAec() {
        return JSON.stringify(this);
    }
    exportJson() {
        return JSON.stringify(this);
    }
    export(type: ChartTypes) {
        switch (type) {
            case 'aec':
                return this.exportAec();
            case 'json':
                return this.exportJson();
        }
    }
}

export function createNewChart(name:string, bpm?: Bpm): ChartData {
    return new ChartData({
        meta: {name, bpm: bpm || new Bpm([{beat: new Fraction(0), bpm: 120}]), id: createMd5()},
        data:{
            lines: [new ChartLine({id: 0, start: [0, 0], speed: 1})],
            themes: [new ChartThemeEvent({time: new Fraction(0)})]
        }
    });
}

export async function createAecFile(chart: ChartData, music: ArrayBuffer|Blob|File) {
    const musicArrBuf = await saveAudio(chart.getId(), music);
     
    return {chart, music: musicArrBuf};
}

export function parseAecChart(aecChart: ChartAecFile) {
    const {meta, data} = aecChart;
    const {lines, themes} = data;

    if (lines.length === 0) {
        lines.push({id: 0, speed: 1, start: [0, 0]});
    }
    if (themes.length === 0) {
        themes.push({time: new Fraction(0)});
    }
    const chart = new ChartData({
        meta: meta,
        data: {
            lines: lines.map(line => new ChartLine(line)) as [ChartLine, ...ChartLine[]],
            themes: themes.map(theme => new ChartThemeEvent(theme)) as [ChartThemeEvent, ...ChartThemeEvent[]]
        }
    });
    
    return chart;
}