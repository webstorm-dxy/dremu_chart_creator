import Bpm from "@scripts/chart-data/bpm/bpm";
import ChartData from "@scripts/chart-data/chart-data";
import { ChartDotEvent } from "@scripts/chart-data/event/dot";
import ChartLine from "@scripts/chart-data/line";
import Ease from "@scripts/utils/ease";
import Fraction from "fraction.js";

export const bpm = new Bpm([{bpm: 120, beat: new Fraction(0)}]);

export const chart = new ChartData({
    meta: {name: 'Test'},
    data: {
        lines: [
            new ChartLine({
                id: 0,
                speed: 1,
                start: [-4, -3.5],
                notes: [],
                dots: [
                    new ChartDotEvent({
                        time: new Fraction(20),
                        position: 0,
                        ease: new Ease(0)
                    }),
                    new ChartDotEvent({
                        time: new Fraction(40),
                        position: 2,
                        ease: new Ease(5)
                    }),
                    new ChartDotEvent({
                        time: new Fraction(50),
                        position: -1,
                        ease: new Ease(6)
                    })
                ]
            }),
            new ChartLine({
                id: 1,
                speed: 1,
                start: [4, -4],
                notes: [],
                dots: [
                    new ChartDotEvent({
                        time: new Fraction(10),
                        position: 0,
                        ease: new Ease(0)
                    }),
                    new ChartDotEvent({
                        time: new Fraction(15),
                        position: 2,
                        ease: new Ease(12)
                    })
                ]
            })
        ]
    },
});