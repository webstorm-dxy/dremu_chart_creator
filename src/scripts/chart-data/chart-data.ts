import { ChartAecFile } from "@interfaces/chart-data/aecFile";
import { ChartDataArgs, ChartFlickEventDirections, ChartNoteEventType, ChartTypes, Data, IChartChangeEvent, IChartDargNoteEvent, IChartEvent, IChartFlickNoteEvent, IChartHoldNoteEvent, IChartLine, IChartNoteEvent, IChartSustainEvent, IChartTapNoteEvent, IChartThemeEvent, IChartThemes, Meta } from "@interfaces/chart-data/chart-data.d";
import { createMd5 } from "@scripts/utils/crypto/md5";
import { saveAudio } from "@scripts/utils/fs/audio";
import Fraction from "fraction.js";
import Bpm from "./bpm/bpm";
import { assign } from "lodash";


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

    getLine = (id: Int) => {
        return findLine(this.data.lines, id);
    };

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
        return JSON.stringify(this);
    }
    export(type: ChartTypes) {
        switch (type) {
            case 'aec':
                return this.exportAec();
            case 'json':
                return this.exportJson();
        }
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

export function findLine(lines: IChartLine[], id: Int): IChartLine | null {
    if (!lines || (!id && id !== 0)) return null;
    for (const line of lines) {
        if (line.id === id) return line;
        return findLine(line.children, id);
    }
    return null;
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
    export function createEvent(time?: Fraction | number) {
        return { time: new Fraction(time || 0) };
    }

    export function createSustainEvent(attrs: Partial<IChartSustainEvent> = {}): IChartSustainEvent {
        return assign(createEvent(), { endTime: new Fraction(0) }, attrs);
    }

    export function createChangeEvent<T>(defaultValue: T, attrs: Partial<IChartChangeEvent<T>> = {}): IChartChangeEvent<T> {
        return assign(createEvent(), { from: defaultValue, to: defaultValue }, attrs);
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
        return assign(createNoteEvent({ type: ChartNoteEventType.Drag }), attrs);
    }

    export function createFlickNoteEvent(attrs: Partial<IChartFlickNoteEvent> = {}): IChartFlickNoteEvent {
        return assign(createNoteEvent({ type: ChartNoteEventType.Flick }), { direction: ChartFlickEventDirections.Up }, attrs);
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