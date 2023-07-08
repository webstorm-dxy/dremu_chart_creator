import { TimelineEngine } from "@xzdarcy/react-timeline-editor";
import Bpm from "../chart-data/bpm/bpm";
import Fraction from "fraction.js";

export default class TimelineTicker extends TimelineEngine {
    protected bpm: Bpm | null;

    constructor(bpm?: Bpm) {
        super();
        this.bpm = bpm || null;

    }

    setBeat(beat: Fraction | number) {
        super.setTime(beat instanceof Fraction ? beat.valueOf() : beat);
    }

    protected _tick = (data: { now: number; autoEnd?: boolean; to?: number }) => {
        if (this.isPaused) return;
        const { now, autoEnd, to } = data;

        // 计算当前时间
        let currentTime = this.getTime()
            + (this.bpm?.toBeat((Math.min(1000, now - this._prev) / 1000) * this._playRate).valueOf() || 0);
        this._prev = now;

        // 设置当前时间
        if (to && to <= currentTime) currentTime = to;
        this.setTime(currentTime, true);

        // 执行动作
        this._tickAction(currentTime);
        // 自动停止情况下，判断是否所有动作执行完毕
        if (!to && autoEnd && this._next >= this._actionSortIds.length && this._activeActionIds.length === 0) {
            this._end();
            return;
        }

        // 判断是否终止
        if (to && to <= currentTime) {
            this._end();
        }

        if (this.isPaused) return;
        this._timerId = requestAnimationFrame((time) => {
            this._tick({ now: time, autoEnd, to });
        });
    };

    changeBpm(bpm: Bpm) {
        this.bpm = bpm;
    }
}