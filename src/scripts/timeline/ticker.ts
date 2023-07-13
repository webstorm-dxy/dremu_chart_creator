import { TimelineEngine, TimelineRow } from "@xzdarcy/react-timeline-editor";
import Bpm from "../chart-data/bpm/bpm";
import Fraction from "fraction.js";

export default class TimelineTicker extends TimelineEngine {
    protected bpm: Bpm | null;
    protected _delta: number = 0;

    constructor(bpm?: Bpm) {
        super();
        this.bpm = bpm || null;
    }

    setTime(time: number, isTick?: boolean, noEffectEvent: boolean = false): boolean {
        const result = isTick || this.trigger('beforeSetTime', { time, engine: this });
        if (!result) return false;

        if (this._currentTime === time) return false;
        this._currentTime = time;

        if (!noEffectEvent) {
            this._next = 0;
            this._dealLeave(time);
            this._dealEnter(time);
        }
        if (isTick) this.trigger('setTimeByTick', { time, engine: this });
        else this.trigger('afterSetTime', { time, engine: this });
        return true;
    }

    setBeat(beat: Fraction | number, isTick?: boolean, noEffectEvent: boolean = false) {
        this.setTime(beat instanceof Fraction ? beat.valueOf() : beat, isTick, noEffectEvent);
    }

    reSetData(data: TimelineRow[]) {
        super._dealData(data);
    }

    changeBpm(bpm: Bpm) {
        this.bpm = bpm;
    }
}