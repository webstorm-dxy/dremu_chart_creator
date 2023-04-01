import { LineEventArgs, LineEvents } from "@interfaces/chart-data/event/line-events";
import { ChartLineArgs } from "@interfaces/chart-data/line";
import { Int } from "@interfaces/global-type";
import { Vec2 } from "@scripts/utils/vec/vec";
import { ChartDotEvent } from "./event/dot";
import { ChartMoveEvent } from "./event/move";
import { ChartNoteEvent } from "./event/note/note";
import { ChartRotateEvent } from "./event/rotate";
import { ChartTimingEvent } from "./event/timing";
import { ChartAlphaEvent } from "./event/alpha";
import { ChartMoveXEvent } from "./event/move-x";
import { ChartMoveYEvent } from "./event/move-y";
import { ChartEvent } from "./event/event";
import { ChartNoteEventArgs } from "@/interfaces/chart-data/event/note/note";
import { ChartDotEventArgs } from "@/interfaces/chart-data/event/dot";
import { ChartAlphaEventArgs } from "@/interfaces/chart-data/event/alpha";
import { ChartMoveXEventArgs } from "@/interfaces/chart-data/event/move-x";
import { ChartMoveYEventArgs } from "@/interfaces/chart-data/event/move-y";
import { ChartTimingEventArgs } from "@/interfaces/chart-data/event/timing";
import { ChartRotateEventArgs } from "@/interfaces/chart-data/event/rotate";


export default class ChartLine {
    id: Int;
    speed: number;
    start: Vec2;
    parent?: ChartLine | undefined;
    notes: ChartNoteEvent[];
    dots: ChartDotEvent[];
    alphas: ChartAlphaEvent[];
    moveXs: ChartMoveXEvent[];
    moveYs: ChartMoveYEvent[];
    timings: ChartTimingEvent[];
    rotates: ChartRotateEvent[];

    constructor({ id, speed, start, parent, notes = [], dots = [], alphas = [], moveXs = [], moveYs = [], timings = [], rotates = [] }: ChartLineArgs) {
        const toEvents = ChartLine.toEvents;
        this.id = id >= 0 ? id : 0;
        this.speed = speed;
        this.start = start;
        this.parent = parent || undefined;
        this.notes = toEvents('notes', notes);
        this.dots = toEvents('dots', dots);
        this.alphas = toEvents('alphas', alphas);
        this.moveXs = toEvents('moveXs', moveXs);
        this.moveYs = toEvents('moveYs', moveYs);
        this.timings = toEvents('timings', timings);
        this.rotates = toEvents('rotates', rotates);
    }
    private static toEvent<E extends LineEvents | LineEventArgs, T extends keyof Omit<ChartLineArgs, 'id' | 'speed' | 'start' | 'parent'>>(type: T, ev: E) {
        if (ev instanceof ChartEvent) return ev as ChartLine[T][0];

        switch (type) {
            case 'notes': return ChartNoteEvent.create(ev as ChartNoteEventArgs);
            case 'dots': return new ChartDotEvent(ev as ChartDotEventArgs);
            case 'alphas': return new ChartAlphaEvent(ev as ChartAlphaEventArgs);
            case 'moveXs': return new ChartMoveXEvent(ev as ChartMoveXEventArgs);
            case 'moveYs': return new ChartMoveYEvent(ev as ChartMoveYEventArgs);
            case 'timings': return new ChartTimingEvent(ev as ChartTimingEventArgs);
            case 'rotates': return new ChartRotateEvent(ev as ChartRotateEventArgs);
        }
    }
    private static toEvents<E extends LineEvents | LineEventArgs, T extends keyof Omit<ChartLineArgs, 'id' | 'speed' | 'start' | 'parent'>>(type: T, evs: E[]): ChartLine[T] {
        return evs.map(ev => ChartLine.toEvent<E, T>(type, ev)) as ChartLine[T];
    }
    private sortAddEvent<T extends LineEvents>(arr: T[], ev: T) {
        const index = arr.findIndex(v => v.time > ev.time) - 1;
        arr.splice(index < 0 ? 0 : index, 0, ev);
    }
    addEvent(ev: LineEvents): void {
        if (ev instanceof ChartNoteEvent) {
            this.sortAddEvent<ChartNoteEvent>(this.notes, ev);
        } else if (ev instanceof ChartDotEvent) {
            this.sortAddEvent<ChartDotEvent>(this.dots, ev);
        } else if (ev instanceof ChartAlphaEvent) {
            this.sortAddEvent<ChartAlphaEvent>(this.alphas, ev);
        } else if (ev instanceof ChartMoveXEvent) {
            this.sortAddEvent<ChartMoveXEvent>(this.moveXs, ev);
        } else if (ev instanceof ChartMoveYEvent) {
            this.sortAddEvent<ChartMoveYEvent>(this.moveYs, ev);
        } else if (ev instanceof ChartTimingEvent) {
            this.sortAddEvent<ChartTimingEvent>(this.timings, ev);
        } else if (ev instanceof ChartRotateEvent) {
            this.sortAddEvent<ChartRotateEvent>(this.rotates, ev);
        }
    }
    addEvents(...evs: LineEvents[]): void {
        evs.forEach(ev => this.addEvent(ev));
    }
}