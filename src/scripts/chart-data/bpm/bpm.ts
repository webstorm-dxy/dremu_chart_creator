import { Beat } from "@interfaces/chart-data/chart-data";
import Fraction from "fraction.js";
import { assign } from "lodash";

export interface IBpm<T extends Fraction | number = Fraction | number> {
    beat: Beat<T>;
    bpm: number;
}

export interface ICacheBpm extends IBpm<Fraction> {
    /**
     * @description 对应时间的缓存
     * ms
     */
    cache?: number | null;
}

export default class Bpm {
    bpms: ICacheBpm[] = [];

    constructor(bpm?: IBpm[]) {
        this.reset(bpm);
    }

    get length(): number { return this.bpms.length; }

    static countTime = (bpm: number, beat: number | Fraction) => {
        return bpm === 0 ? 0 : 60 / bpm * (beat instanceof Fraction ? beat.valueOf() : beat);
    };

    static countBeat = (bpm: number, time: number): Fraction => {
        const res = time * bpm / 60;
        return new Fraction(res);
    };

    static countBpm = (beat: number|Fraction, time: number): number => {
        return 60 * (beat instanceof Fraction ? beat.valueOf(): beat) / time;
    }; 

    getCache = (index: number) => {
        const info = this.bpms[index];
        if (!info) return;

        if (index === 0) { info.cache = 0; return; }

        const lastInfo = this.bpms[index - 1];
        if (lastInfo.bpm === 0) {
            if (!lastInfo.cache && index !== 1) this.getCache(index - 1);
            info.cache = lastInfo.cache || 0;
            return;
        }

        const lastTime = this.toTime(lastInfo.beat);
        info.cache = lastTime + Bpm.countTime(lastInfo.bpm, info.beat.valueOf() - lastInfo.beat.valueOf());
    };

    toTime = (beat: number | Fraction): number => {
        const targetBeat = beat instanceof Fraction ? beat.valueOf() : beat;

        // 查找最近计算信息
        const startInfoIndex = this.bpms.findLastIndex(info => info.beat.valueOf() <= targetBeat);

        // 处理负值，以第一个bpm信息计算
        if (startInfoIndex === -1) return Bpm.countTime(this.bpms[0].bpm, targetBeat);

        const startInfo = this.bpms[startInfoIndex];
        const startInfoBeat = startInfo.beat.valueOf();

        // 无缓存情况下计算并缓存
        if (!startInfo.cache && startInfo.cache !== 0) this.getCache(startInfoIndex);

        // 返回转换结果
        if (startInfoBeat === targetBeat) return startInfo.cache;
        return startInfo.cache + Bpm.countTime(startInfo.bpm, targetBeat - startInfoBeat);
    };

    toBeat = (time: number): Fraction => {
        const startInfoIndex = this.bpms.findLastIndex((info, i) => {
            if (!info.cache) this.getCache(i);
            return info.cache <= time;
        });

        // 处理负值, 以第一bpm信息计算
        if (startInfoIndex === -1) return Bpm.countBeat(this.bpms[0].bpm, time);

        const startInfo = this.bpms[startInfoIndex];

        // 返回转换结果
        if (startInfo.cache === time) return startInfo.beat;
        return startInfo.beat.add(Bpm.countBeat(startInfo.bpm, time - startInfo.cache));
    };

    clearCache = (from: number = 0, to: number = this.bpms.length) => {
        for (; from < to; from++) {
            if (!this.bpms[from] || !this.bpms[from].cache) continue;
            this.bpms[from].cache = null;
        }
    };

    static checkInfo = (info: Partial<IBpm>, unDefault: boolean = false) => {
        return {
            beat: info.beat instanceof Fraction ? info.beat : unDefault ? null : new Fraction(info.beat || 0),
            bpm: unDefault ? info.bpm : (info.bpm ?? 120)
        };
    };

    set = (index: number, bpmInfo: Partial<IBpm>) => {
        const info = Bpm.checkInfo(bpmInfo, true);
        const oldInfo = this.remove(index);
        this.add(assign(oldInfo, info));
    };

    add = (info: IBpm, clearCache: boolean = true): number => {
        if (!info) return -1;
        const { beat, bpm } = Bpm.checkInfo(info);

        const startInfoIndex = this.bpms.findLastIndex((info, i) => info.beat.compare(beat) <= 0);
        const startInfo = this.bpms[startInfoIndex];

        if (startInfoIndex === -1) {
            this.bpms.unshift({ beat, bpm: bpm });
            return 0;
        }
        if (startInfo.beat.compare(beat) === 0) {
            startInfo.bpm = bpm ?? startInfo.bpm;
            if (clearCache) this.clearCache(startInfoIndex);
            return startInfoIndex;
        }
        this.bpms.splice(startInfoIndex + 1, 0, { beat, bpm: bpm });
        if (clearCache) this.clearCache(startInfoIndex + 1);
        return startInfoIndex + 1;
    };

    remove = (indexOrFn: number | ((info: IBpm<Fraction>, index: number, bpm: IBpm<Fraction>[]) => boolean), clearCache: boolean = true): IBpm<Fraction> | null => {
        if (typeof indexOrFn === 'number') {
            const res = this.bpms.splice(indexOrFn, 1)[0];
            if (clearCache) this.clearCache(indexOrFn);
            return res;
        }
        if (indexOrFn instanceof Function) {
            const index = this.bpms.findIndex(indexOrFn);
            if (index === -1) return null;
            return this.remove(index);
        }
        return null;
    };

    reset = (bpm?: IBpm[]) => {
        if (!bpm) {
            this.add({ bpm: 120, beat: new Fraction(0) });
            return this;
        }
        for (let i = 0; i < bpm.length; i++) {
            this.add(bpm[i], false);
        }
        this.clearCache();
        return this;
    };
}