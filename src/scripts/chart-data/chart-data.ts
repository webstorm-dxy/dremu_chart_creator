import { ChartAecFile } from "@interfaces/chart-data/aecFile";
import { ChartDataArgs, ChartFlickEventDirections, ChartNoteEventType, ChartTypes, Data, IChartAlphaEvent, IChartChangeEvent, IChartDargNoteEvent, IChartDotEvent, IChartEaseEvent, IChartEvent, IChartFlickNoteEvent, IChartHoldNoteEvent, IChartLine, IChartMoveEvent, IChartNoteEvent, IChartNoteEvents, IChartRotateEvent, IChartSustainEvent, IChartTapNoteEvent, IChartThemeEvent, IChartThemes, IChartTimingEvent, Meta } from "@interfaces/chart-data/chart-data.d";
import { createMd5 } from "@scripts/utils/crypto/md5";
import { saveAudio } from "@scripts/utils/fs/audio";
import Fraction from "fraction.js";
import Bpm from "./bpm/bpm";
import { assign, cloneDeep } from "lodash";
import { BaseDirectory, FsOptions, writeFile } from "@tauri-apps/api/fs";
import downloadFileFromData from "../utils/fs/download-text-file-from-data";
import { notification } from "antd";
import { IEvents } from "@/interfaces/chart-data/event-manager";


export default class ChartData {
    /**
     * @description 谱面数据的类
     */
    meta: Meta;
    data: Readonly<Data>;

    constructor({ meta, data }: ChartDataArgs) {
        const id = meta.id ? meta.id : createMd5();
        this.meta = { ...meta, version: ChartData.getVersion(), id } as ChartData['meta'];
        this.data = data;
    }
    setMeta<K extends keyof Meta>(key: K, value: Meta[K]): Meta[K] {
        this.meta[key] = value;
        return this.meta[key];
    }
    getMeta<K extends keyof Meta>(key: K): Meta[K] {
        return this.meta[key];
    }

    getLine = (idOrFn: Int | ((line: IChartLine) => boolean)) => {
        return findLine(this.data.lines, idOrFn);
    };

    getLines = () => getLines(this.data.lines);

    addLine(parent?: IChartLine | Int, attrs?: IChartLine | Omit<IChartLine, 'id'>): IChartLine {
        const lines = this.getLines().sort((a, b) => a.id - b.id);
        let id = lines.length;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.id > i) id = i;
        }
        const newLine = createLine(id, attrs);
        if (parent)
            typeof parent === 'number' ? this.getLine(parent)?.children.push(newLine) : parent.children.push(newLine);
        else this.data.lines.push(newLine);

        return newLine;
    }

    removeLine = (idOrFn: Int | ((line: IChartLine) => boolean)) => removeLine(this.data.lines, idOrFn);

    getLineIndex = (id: Int) => {
        return findLineIndex(this.data.lines, id);
    };

    setLine = (id: Int, data: ((prev: IChartLine) => IChartLine) | Omit<IChartLine, 'id'>) => {
        const line = this.getLine(id);

        Object.keys(data).forEach(key => {
            if (key === 'id') return;
            line[key] &&= data[key];
        });
    };

    getEventById(id: string): { event: IEvents | null, type: keyof Pick<IChartLine, 'notes' | 'alphas' | 'dots' | 'moves' | 'rotates' | 'timings'> | null } {
        let res = { event: null, type: null };
        if (!id) return res;
        this.getLine((line) => {
            let ev;
            ev = line.notes.find(ev => ev.id === id);
            if (ev) { res = { event: ev, type: 'notes' }; return true; }
            ev = line.dots.find(ev => ev.id === id);
            if (ev) { res = { event: ev, type: 'dots' }; return true; }
            ev = line.alphas.find(ev => ev.id === id);
            if (ev) { res = { event: ev, type: 'alphas' }; return true; }
            ev = line.moves.find(ev => ev.id === id);
            if (ev) { res = { event: ev, type: 'moves' }; return true; }
            ev = line.rotates.find(ev => ev.id === id);
            if (ev) { res = { event: ev, type: 'rotates' }; return true; }
            ev = line.timings.find(ev => ev.id === id);
            if (ev) { res = { event: ev, type: 'timings' }; return true; }
        });

        return res;
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
        const offset = this.meta.offset || 0;
        const data = cloneDeep(this.data);

        (data as any).notes = [];
        const childrenLines = [];

        function transformLines(lines: IChartLine[], parent?: IChartLine) {
            return lines.map(line => {
                if (line.dots.length < 2) {
                    console.error('Error: Less than 2 dots in line' + line.id);
                    notification.error({ message: "错误", description: `Line ${line.id} 的 Dot 事件少于2个`, duration: 10 });
                }

                (line as any).startX = parent ? (parent as any).startX + line.start[0] : line.start[0];
                (line as any).startY = parent ? (parent as any).startY + line.start[1] : line.start[1];
                line.start = undefined;

                line.notes.map(ev => {
                    if ((ev.time.compare(line.dots[0].time) < 0) || ((ev as IChartSustainEvent).endTime?.compare(line.dots[line.dots.length - 1].time) > 0)) {
                        notification.warning({ message: "错误", description: `Note ${ev.id} 不在Dot事件范围内, 已被忽略\nat Line ${line.id}`, duration: null });
                        return;
                    }
                    (ev as any).lineId = line.id;
                    (ev as any).tapTime = ev.time;
                    ev.time = undefined;
                    (ev as any).duration = ((ev as IChartSustainEvent).endTime as Fraction)?.sub(ev.time) || undefined;
                    (ev as IChartSustainEvent).endTime = undefined;

                    (data as any).notes.push(ev);
                });
                line.notes = undefined;
                line.moves = line.moves.map(ev => {
                    (ev as any).duration = ev.endTime.sub(ev.time);
                    ev.endTime = undefined;
                    if (parent) {
                        ev.from[0] += (parent as any).startX;
                        ev.from[1] += (parent as any).startY;
                        ev.to[0] += (parent as any).startX;
                        ev.to[1] += (parent as any).startY;
                    }
                    return ev;
                });
                line.alphas = line.alphas.map(ev => {
                    (ev as any).duration = ev.endTime.sub(ev.time);
                    ev.endTime = undefined;
                    return ev;
                });
                line.rotates = line.rotates.map(ev => {
                    (ev as any).duration = ev.endTime.sub(ev.time);
                    ev.endTime = undefined;
                    return ev;
                });

                childrenLines.push(...transformLines(line.children, line));
                line.children = undefined;

                return line;
            }) as unknown as IChartLine[];
        }

        (data.lines as any) = transformLines(data.lines);

        data.lines.push(...childrenLines);
        (data.lines as any) = data.lines.sort((a, b) => a.id - b.id);

        (data.themes as any) = data.themes.map(ev => {
            (ev as any).duration = ev.endTime.sub(ev.time);
            ev.endTime = undefined;
            return ev;
        });

        return JSON.stringify(data, (key: string, value: unknown) => {
            if (key === 'description' || key === 'id') return;
            if (value instanceof Fraction) return Math.round(this.meta.bpm.toTime(value) * 1000 + offset);
            return value;
        });
    }
    export(type: ChartTypes) {
        switch (type) {
            case 'aec':
                return this.exportAec();
            case 'json':
                return this.exportJson();
        }
    }

    saveAec(path: string, options: FsOptions = { dir: BaseDirectory.Resource }) {
        const data = this.exportAec();

        return writeFile(/\.aec$/i.test(path) ? path : path + '.aec', data, options);
    }

    async saveJson(path: string, options: FsOptions = { dir: BaseDirectory.Resource }) {
        const data = this.exportJson();

        return writeFile(/\.json$/i.test(path) ? path : path + '.aec', data, options);
    }

    downloadAec() {
        const data = this.exportAec();
        downloadFileFromData(data, { ext: 'aec', hasTime: true });
    }

    downloadJson() {
        const data = this.exportJson();
        downloadFileFromData(data, { ext: 'json', hasTime: true });
    }
}

export function createNewChart(name: string, bpm?: Bpm): ChartData {
    return new ChartData({
        meta: { name, bpm: bpm || new Bpm([{ beat: new Fraction(0), bpm: 120 }]), id: createMd5(), offset: 0 },
        data: {
            lines: [createLine(0, { start: [0, 0], speed: 1 })],
            themes: [EventCreator.createThemeEvent({ time: new Fraction(0) })]
        }
    });
}

export function getLines(lines: IChartLine[]): IChartLine[] {
    if (!lines) return [];
    const lineArr = [];

    function findLines(lines: IChartLine[]) {
        for (const line of lines) {
            lineArr.push(line);
            findLines(line.children);
        }
    }

    findLines(lines);

    return lineArr;
}

export function findLine(lines: IChartLine[], idOrFn: Int | ((line: IChartLine) => boolean)): IChartLine | null {
    if (!lines || (!idOrFn && idOrFn !== 0)) return null;
    const compareFn = idOrFn instanceof Function ? idOrFn : (line) => line.id === idOrFn;
    for (const line of lines) {
        if (compareFn(line)) return line;
        const child = findLine(line.children, compareFn);
        if (child) return child;
    }
    return null;
}

export function findLineIndex(lines: IChartLine[], id: Int): [number, ...number[]] {
    if (!lines || (!id && id !== 0)) return [-1];
    const res: [number, ...number[]] = [] as unknown as [number, ...number[]];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.id === id) { res.push(i); break; }
        const childIndex = findLineIndex(line.children, id);
        if (childIndex) { childIndex; break; }
    }
    return res.length ? [-1] : res;
}

export function removeLine(lines: IChartLine[], idOrFn: Int | ((line: IChartLine) => boolean)): void {
    if (!lines || (!idOrFn && idOrFn !== 0)) return;
    const compareFn = idOrFn instanceof Function ? idOrFn : (line) => line.id === idOrFn;

    const targetLineIndex = lines.findIndex(line => compareFn(line));
    if (targetLineIndex !== -1)
        lines.splice(targetLineIndex, 1);
    else
        lines.forEach(line => removeLine(line.children, compareFn));
}

export function createLine(id: number, attrs: Partial<Omit<IChartLine, 'id'>> = {}): IChartLine {
    return {
        id,
        start: [0, 0],
        speed: 1,
        children: [],
        description: '',
        notes: [],
        dots: [],
        alphas: [],
        moves: [],
        timings: [],
        rotates: [],
        ...attrs
    };
}

export namespace EventCreator {
    export function createEvent(id?: string, attrs: Partial<Omit<IChartEvent, 'id'>> = {}): IChartEvent {
        return assign({ id: id || createMd5(), time: new Fraction(0) }, attrs);
    }

    export function createSustainEvent(attrs: Partial<IChartSustainEvent> = {}): IChartSustainEvent {
        return assign(createEvent(), { endTime: new Fraction(0) }, attrs);
    }

    export function createEaseEvent(attrs: Partial<IChartEaseEvent> = {}): IChartEaseEvent {
        return assign(createEvent(), { ease: 0 }, attrs);
    }

    export function createChangeEvent<T>(defaultValue: T, attrs: Partial<IChartChangeEvent<T>> = {}): IChartChangeEvent<T> {
        return assign(createEvent(), { from: defaultValue, to: cloneDeep(defaultValue) }, attrs);
    }

    export function createNoteEvent(attrs: Partial<IChartNoteEvent> = {}): IChartNoteEvent {
        return assign(createEvent(), { flag: 15, type: ChartNoteEventType }, attrs);
    }

    export function createTapNoteEvent(attrs: Partial<IChartTapNoteEvent> = {}): IChartTapNoteEvent {
        return assign(createNoteEvent({ type: ChartNoteEventType.Tap }), attrs);
    }

    export function createHoldNoteEvent(attrs: Partial<IChartHoldNoteEvent> = {}): IChartHoldNoteEvent {
        return assign(createNoteEvent({ type: ChartNoteEventType.Hold }), createSustainEvent(), attrs);
    }

    export function createDargNoteEvent(attrs: Partial<IChartDargNoteEvent> = {}): IChartDargNoteEvent {
        return assign(createNoteEvent({ type: ChartNoteEventType.Darg }), attrs);
    }

    export function createFlickNoteEvent(attrs: Partial<IChartFlickNoteEvent> = {}): IChartFlickNoteEvent {
        return assign(createNoteEvent({ type: ChartNoteEventType.Flick }), { direction: ChartFlickEventDirections.Up }, attrs);
    }

    export function createUnknownNoteEvent(attrs: { type: ChartNoteEventType.Tap | ChartNoteEventType } & Partial<IChartNoteEvents>): IChartTapNoteEvent
    export function createUnknownNoteEvent(attrs: { type: ChartNoteEventType.Darg } & Partial<IChartNoteEvents>): IChartDargNoteEvent
    export function createUnknownNoteEvent(attrs: { type: ChartNoteEventType.Hold } & Partial<IChartNoteEvents>): IChartHoldNoteEvent
    export function createUnknownNoteEvent(attrs: { type: ChartNoteEventType.Flick } & Partial<IChartNoteEvents>): IChartFlickNoteEvent
    export function createUnknownNoteEvent(attrs: Partial<IChartNoteEvents> = {}): IChartNoteEvents {
        switch (attrs.type) {
            case ChartNoteEventType.Tap: return createTapNoteEvent(attrs);
            case ChartNoteEventType.Darg: return createDargNoteEvent(attrs);
            case ChartNoteEventType.Hold: return createHoldNoteEvent(attrs);
            case ChartNoteEventType.Flick: return createFlickNoteEvent(attrs);
            default: return createTapNoteEvent(attrs);
        }
    }

    export function createDotEvent(attrs: Partial<IChartDotEvent> = {}): IChartDotEvent {
        return assign(createEaseEvent(), { position: 0, move: null, alpha: null }, attrs);
    }

    export function createAlphaEvent(attrs: Partial<IChartAlphaEvent> = {}): IChartAlphaEvent {
        return assign(createEaseEvent(), createSustainEvent(), createChangeEvent<number>(1), attrs);
    }

    export function createMoveEvent(attrs: Partial<IChartMoveEvent> = {}): IChartMoveEvent {
        return assign(createEaseEvent(), createSustainEvent(), createChangeEvent<Vec2>([0, 0]), attrs);
    }

    export function createTimingEvent(attrs: Partial<IChartTimingEvent> = {}): IChartTimingEvent {
        return assign(createEvent(), { speedRatio: 1 }, attrs);
    }

    export function createRotateEvent(attrs: Partial<IChartRotateEvent> = {}): IChartRotateEvent {
        return assign(createEaseEvent(), createSustainEvent(), createChangeEvent<number>(0), attrs);
    }

    export function createThemeEvent(attrs?: Partial<IChartThemeEvent>): IChartThemeEvent {
        return assign(createSustainEvent(), createChangeEvent(IChartThemes.DEFAULT), attrs);
    }
}

export async function createAecFile(chart: ChartData, music: ArrayBuffer | Blob | File) {
    await saveAudio(chart.getId(), music);

    return chart;
}

export function parseAecChart(aecChart: ChartAecFile) {
    const { meta, data } = aecChart;
    let { lines, themes } = data;

    meta.bpm = new Bpm(meta.bpm.map(bpm => { bpm.beat = new Fraction(bpm.beat); return bpm; }));

    if (lines.length === 0) {
        lines.push(createLine(0));
    }
    if (themes.length === 0) {
        themes.push(EventCreator.createThemeEvent());
    }

    function eventTimeToFraction<T extends IChartEvent | IChartSustainEvent>(event: T) {
        event.id ||= createMd5();
        event.time = new Fraction(event.time);
        if ((event as IChartSustainEvent).endTime)
            (event as IChartSustainEvent).endTime = new Fraction((event as IChartSustainEvent).endTime);
        return event;
    }

    function timeToFraction(lines: IChartLine[]) {
        if (!lines) return [];
        return lines.map(line => {
            line.notes = line.notes.map(ev => eventTimeToFraction(ev));
            line.dots = line.dots.map(ev => eventTimeToFraction(ev));
            line.moves = line.moves.map(ev => eventTimeToFraction(ev));
            line.alphas = line.alphas.map(ev => eventTimeToFraction(ev));
            line.rotates = line.rotates.map(ev => eventTimeToFraction(ev));
            line.timings = line.timings.map(ev => eventTimeToFraction(ev));
            line.children = timeToFraction(line.children);
            return line;
        });
    }

    lines = timeToFraction(lines) as [IChartLine, ...IChartLine[]];
    themes = themes.map(ev => eventTimeToFraction(ev)) as [IChartThemeEvent, ...IChartThemeEvent[]];

    const chart = new ChartData({
        meta: meta,
        data: {
            lines,
            themes
        }
    });

    return chart;
}