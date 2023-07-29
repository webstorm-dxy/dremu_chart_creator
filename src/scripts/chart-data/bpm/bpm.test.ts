import Fraction from "fraction.js";
import Bpm from "@/scripts/chart-data/bpm/bpm";

const bpm = new Bpm();

test('default value test', () => {
    expect(bpm.length).toBe(1);
    expect(bpm.bpms[0]).toEqual({ beat: new Fraction(0), bpm: 120 });
});

test('beat to time', () => {
    const beats = [
        new Fraction(1),
        new Fraction(120),
        new Fraction(60),
        new Fraction(0),
        new Fraction(-120),
        new Fraction(170),
    ];
    beats.forEach(beat => {
        expect(bpm.toTime(beat.clone())).toBe(beat.valueOf() * 60 / 120);
    });
});

test('time to beat', () => {
    const timeList = [1, 120, 60, 0, -120, 170];
    timeList.forEach(time => {
        expect(bpm.toBeat(time).valueOf()).toBe(time * 120 / 60);
    });
});

test('add', () => {
    const infos = [
        { beat: 40, bpm: 75 },
        { beat: 95, bpm: 175 },
        { beat: 45, bpm: 80 },
        { beat: 100, bpm: 0 },
        { beat: -1, bpm: 5 },
        { beat: new Fraction(205), bpm: 55 },
        { beat: new Fraction(205), bpm: 65 },
        { beat: 250, bpm: -55 },
        { beat: 260, bpm: 0 },
        { beat: -260, bpm: 0 },
        { beat: -20, bpm: -12 },
    ];
    infos.forEach(info => bpm.add(info));

    expect(bpm.bpms.map(info => {
        info.beat = info.beat.valueOf() as unknown as Fraction;
        delete info.cache;
        return info;
    })).toEqual([
        { beat: -260, bpm: 0 },
        { beat: -20, bpm: -12 },
        { beat: -1, bpm: 5 },
        { beat: 0, bpm: 120 },
        { beat: 40, bpm: 75 },
        { beat: 45, bpm: 80 },
        { beat: 95, bpm: 175 },
        { beat: 100, bpm: 0 },
        { beat: 205, bpm: 65 },
        { beat: 250, bpm: -55 },
        { beat: 260, bpm: 0 },
    ]);
});