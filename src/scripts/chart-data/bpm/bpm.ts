import { IBpm } from "@interfaces/chart-data/bpm";
import { Beat } from "@interfaces/chart-data/chart-data";
import { Int } from "@interfaces/global-type";
import Fraction from "fraction.js";

export default class Bpm extends Array<IBpm>{
    musicLength: number;

    constructor(bpm: IBpm[], musicLength?: number) {
        super();
        this.push(...bpm);
        this.musicLength = musicLength ?? 120;
    }

    // 获取到音乐结束时的 beat 数
    getLength(): Beat {
        const beatLength = new Fraction(0);

        for (let i = 0, nextBeat = 0; i < this.length; i++) {
            // 计算时间段
            if (i + 1 == this.length) {
                nextBeat = this.musicLength;
            } else {
                nextBeat = this[i + 1].beat.valueOf();
            }
            // 计算时间段内拍子数
            beatLength.add((nextBeat - this[i].beat.valueOf()) / 60 * this[i].bpm);
        }
        return beatLength;
    }

    toTime(beat: Beat, longest: boolean = false): number {
        if (!beat) return 0;
        const time: number = beat.valueOf();
        let beatLength: number = 0, lastBeatLength: number = 0, nextTime: number = 0;

        for (let i = 0; i < this.length; i++) {
            if (i + 1 >= this.length) {
                if (longest) {
                    nextTime = 9999999;
                } else {
                    nextTime = this.musicLength;
                }
            } else {
                nextTime = this[i + 1].beat.valueOf();
            }
            lastBeatLength = beatLength;
            beatLength += (nextTime - this[i].beat.valueOf()) / 60 * this[i].bpm;
            if (beatLength > time) {

                return this[i].beat.valueOf() + 60 / this[i].bpm * (time - lastBeatLength);
            }
        }

        return this.musicLength;
    }

    toBeat(time: number | Fraction): Fraction {
        if (!time) return new Fraction(0);
        time instanceof Fraction ? null : time = new Fraction(time);

        let nextTime: Fraction = new Fraction(0);
        const _60 = new Fraction(60);

        for (let i = 0; i < this.length; i++) {
            if (i + 1 == this.length || time.compare(this[i + 1].beat) <= 0) {
                const beatLength: Fraction = new Fraction(0);

                for (let j = 0; j < i; j++) {
                    if (j == i) {
                        nextTime = time.clone();
                    } else {
                        nextTime = this[j + 1].beat.clone();
                    }
                    beatLength.add(nextTime.sub(this[j].beat).div(_60).mul(new Fraction(this[j].bpm)));
                }

                return time.sub(this[i].beat)
                    .div(_60)
                    .mul(new Fraction(this[i].bpm))
                    .add(new Fraction(beatLength));
            }
        }
    }
    setBpmList(bpmList: IBpm[]) {
        this.splice(0, this.length, ...bpmList);
    }
    addBpm(bpm: IBpm): Int {
        let added = false;

        for (let i = 0; i < this.length; i++) {
            const bpm = this[i];

            if (bpm.beat.compare(bpm.beat) > 0) {
                if (!added) {
                    this.splice(i, 0, bpm);
                    added = true;
                    return i + 1;
                }
            }
        }
        if (!added) {
            this.push(bpm);
            return this.length - 1;
        }
    }
    setBpm(index: number, bpm: IBpm) {
        if (index === 0) {
            this[0].bpm = bpm.bpm;
            return;
        }
        this.splice(index, 1);
        for (let i = 0; i < this.length; i++) {
            if (this[i].beat.compare(bpm.beat) > 0) {
                this.splice(i, 0, bpm);
                break;
            } else if (i === this.length - 1) {
                this.push(bpm);
                break;
            }
        }
    }

    removeBpm(index: number) {
        this.splice(index, 1);
        if (index === 0) {
            this[0].beat = new Fraction(0);
        }
    }

    setMusicLength(length: number) {
        this.musicLength = length;
    }
}