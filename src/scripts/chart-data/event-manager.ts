import { Beat } from "@/interfaces/chart-data/chart-data";
import { IDuringEvent, IEvents } from "@/interfaces/chart-data/event-manager";
import Fraction from "fraction.js";
import Bpm from "./bpm/bpm";

export function getDuring<T extends IEvents>(events: T[], bpm: Bpm, time: Beat | number): IDuringEvent<T> {
    if (typeof time === 'number') time = bpm.toBeat(time);
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