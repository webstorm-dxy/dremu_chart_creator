import { ChartLineArgs } from "@interfaces/chart-data/line";
import { Int } from "@interfaces/global-type";
import { Vec2 } from "@scripts/utils/vec/vec";
import type { ChartDotEvent } from "./event/dot";
import type { ChartMoveEvent } from "./event/move";
import type { ChartNoteEvent } from "./event/note/note";
import type { ChartRotateEvent } from "./event/rotate";
import type { ChartTimingEvent } from "./event/timing";


export default class ChartLine {
    id: Int;
    speed: number;
    start: Vec2;
    notes: ChartNoteEvent[];
    dots: ChartDotEvent[];
    moves: ChartMoveEvent[];
    timings: ChartTimingEvent[];
    rotates: ChartRotateEvent[];

    constructor({id, speed, start, notes=[], dots=[], moves=[], timings=[], rotates=[]}: ChartLineArgs) {
        this.id = id >= 0 ? id : 0;
        this.speed = speed;
        this.start = start;
        this.notes = notes;
        this.dots = dots;
        this.moves = moves;
        this.timings = timings;
        this.rotates = rotates;
    }
}