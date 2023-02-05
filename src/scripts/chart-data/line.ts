import { LineEvents } from "@interfaces/chart-data/event/line-events";
import { ChartLineArgs } from "@interfaces/chart-data/line";
import { Int } from "@interfaces/global-type";
import { Vec2 } from "@scripts/utils/vec/vec";
import { ChartDotEvent } from "./event/dot";
import { ChartMoveEvent } from "./event/move";
import { ChartNoteEvent } from "./event/note/note";
import { ChartRotateEvent } from "./event/rotate";
import { ChartTimingEvent } from "./event/timing";


export default class ChartLine {
    id: Int;
    speed: number;
    start: Vec2;
    parent?: ChartLine | undefined;
    notes: ChartNoteEvent[];
    dots: ChartDotEvent[];
    moves: ChartMoveEvent[];
    timings: ChartTimingEvent[];
    rotates: ChartRotateEvent[];

    constructor({ id, speed, start, parent, notes = [], dots = [], moves = [], timings = [], rotates = [] }: ChartLineArgs) {
        this.id = id >= 0 ? id : 0;
        this.speed = speed;
        this.start = start;
        this.parent = parent || undefined;
        this.notes = notes;
        this.dots = dots;
        this.moves = moves;
        this.timings = timings;
        this.rotates = rotates;
    }
    private sortAddEvent(arr: LineEvents[], ev: LineEvents) {
        const index = arr.findIndex(v => v.time > ev.time) - 1;
        arr.splice(index < 0 ? 0 : index, 0, ev);
    }
    addEvent(ev: LineEvents): void {
        if (ev instanceof ChartNoteEvent) {
            this.sortAddEvent(this.notes, ev);
        } else if (ev instanceof ChartDotEvent) {
            this.sortAddEvent(this.dots, ev);
        } else if (ev instanceof ChartMoveEvent) {
            this.sortAddEvent(this.moves, ev);
        } else if (ev instanceof ChartTimingEvent) {
            this.sortAddEvent(this.timings, ev);
        } else if (ev instanceof ChartRotateEvent) {
            this.sortAddEvent(this.rotates, ev);
        }
    }
    addEvents(...evs: LineEvents[]): void {
        evs.forEach(ev => this.addEvent(ev));
    }
}