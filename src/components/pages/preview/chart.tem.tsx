import { ChartAlphaEvent } from "@/scripts/chart-data/event/alpha";
import { ChartRotateEvent } from "@/scripts/chart-data/event/rotate";
import ChartThemeEvent from "@/scripts/chart-data/event/theme";
import Bpm from "@scripts/chart-data/bpm/bpm";
import ChartData from "@scripts/chart-data/chart-data";
import { ChartDotEvent } from "@scripts/chart-data/event/dot";
import ChartLine from "@scripts/chart-data/line";
import Ease from "@scripts/utils/ease";
import Fraction from "fraction.js";

export const bpm = new Bpm([{ bpm: 120, beat: new Fraction(0) }]);

export const chart = new ChartData({
    meta: { name: 'Test', bpm },
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
                ],
                rotates: [
                    new ChartRotateEvent({
                        time: new Fraction(15),
                        endTime: new Fraction(25),
                        from: 0,
                        to: 45,
                        ease: new Ease(8)
                    })
                ],
                alphas: [
                    new ChartAlphaEvent({
                        time: new Fraction(30),
                        endTime: new Fraction(50),
                        from: 1,
                        to: 0.5,
                        ease: new Ease(8)
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
        ],
        themes: [new ChartThemeEvent({ time: new Fraction(0) })]
    },
});