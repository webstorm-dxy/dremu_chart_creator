import { Beat } from "@/interfaces/chart-data/chart-data";
import { IDuringEvent, IEvents } from "@/interfaces/chart-data/event-manager";
import Fraction from "fraction.js";
import Bpm from "./bpm/bpm";

export class EventManager<TofEv extends IEvents> extends Array<TofEv> {
    bpm: Bpm;

    constructor(bpm: Bpm, ...events: TofEv[]) {
        super();
        super.push(...events);
        this.bpm = bpm;
    }
    getDuring(time: Beat|number): IDuringEvent<TofEv> {
        const events = this;
        if(typeof time === 'number') time = this.bpm.toBeat(time);
        const beat = time.valueOf();
        const last = events[events.length - 1] as unknown as { time: Fraction, endTime: Fraction };

        if (beat > (last?.endTime?.valueOf() || last?.time.valueOf()))
            return { event: null, index: events.length - 1 };

        // todo 待改成二分搜索
        for (let i = events.length - 1; i >= 0; i--) {
            const event = events[i];
            if (event.time.valueOf() <= beat) {
                return { event: event, index: i };
            }
        }

        return { event: null, index: null };
    }
}