import { EaseResultArgs, EaseTypeInfo } from "@interfaces/util/ease";
import { Vec2 } from "./vec/vec";

const easeTypes: EaseTypeInfo[] = [
    { countFn(t) { return t; }, name: "linearity" }, // 0
    { p0: [0.12, 0], p1: [0.39, 0], countFn: (t) => 1 - Math.cos((t * Math.PI) / 2), name: 'ease in Sine' }, // 1
    { p0: [0.61, 1], p1: [0.88, 1], countFn: (t) => Math.sin((t * Math.PI) / 2), name: 'ease out Sine' }, // 2
    { p0: [0.37, 0], p1: [0.63, 1], countFn: (t) => -(Math.cos(Math.PI * t) - 1) / 2, name: 'ease in out Sine' }, // 3
    { p0: [0.11, 0], p1: [0.5, 0], countFn: (t) => t * t, name: 'ease in quad' }, // 4
    { p0: [0.5, 1], p1: [0.89, 1], countFn: (t) => t ** 2 - 2 * t, name: 'ease out quad' }, // 5
    { p0: [0.45, 0], p1: [0.55, 1], countFn: (t) => t < 0.5 ? 2 * t ** 2 : 1 - Math.pow(-2 * t + 2, 2) / 2, name: 'ease in out quad' }, // 6
    { p0: [0.32, 0], p1: [0.67, 0], countFn: (t) => t ** 3, name: 'ease in cubic' }, // 7
    { p0: [0.33, 1], p1: [0.68, 1], countFn: (t) => 1 - (1 - t) ** 3, name: 'ease out cubic' }, // 8
    { p0: [0.65, 0], p1: [0.35, 1], countFn: (t) => t < 0.5 ? 4 * t ** 3 : 1 - Math.pow(-2 * t + 2, 3) / 2, name: 'ease in out cubic' }, // 9
    { p0: [0.5, 0], p1: [0.75, 0], countFn: (t) => t ** 4, name: 'ease in quart' }, // 10
    { p0: [0.25, 1], p1: [0.5, 1], countFn: (t) => 1 - (1 - t) ** 4, name: 'ease out quart' }, // 11
    { p0: [0.76, 0], p1: [0.24, 1], countFn: (t) => t < 0.5 ? 8 * (t ** 4) : 1 - Math.pow(-2 * t + 2, 4) / 2, name: 'ease in out quart' }, // 12
    { p0: [0.64, 0], p1: [0.78, 0], countFn: (t) => t ** 5, name: 'ease in quint' }, // 13
    { p0: [0.22, 1], p1: [0.36, 1], countFn: (t) => 1 - (1 - t) ** 5, name: 'ease out quint' },  // 14
    { p0: [0.83, 0], p1: [0.17, 1], countFn: (t) => t < 0.5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2, name: 'ease in out quint' }, // 15
    { p0: [0.7, 0], p1: [0.84, 0], countFn: (t) => t === 0 ? 0 : 2 ** 10 * t - 10, name: 'ease in expo' }, // 16
    { p0: [0.16, 0], p1: [0.3, 1], countFn: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t), name: 'ease out expo' }, // 17
    { p0: [0.87, 0], p1: [0.13, 1], countFn: (t) => t === 0 || t === 1 ? t : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2, name: 'ease in out expo' }, // 18
    { p0: [0.55, 0], p1: [1, 0.45], countFn: (t) => 1 - Math.sqrt(1 - Math.pow(t, 2)), name: 'ease in circ' }, // 19
    { p0: [0, 0.55], p1: [0.45, 1], countFn: (t) => Math.sqrt(1 - Math.pow(t - 1, 2)), name: 'ease out circ' }, // 20
    { p0: [0.85, 0], p1: [0.15, 1], countFn: (t) => t < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2, name: 'ease in out circ' }, // 21
    { p0: [0.36, 0], p1: [0.66, -0.56], countFn: (t) => { const c1 = 1.70158; const c3 = c1 + 1; return c3 * t ** 3 - c1 * t ** 2; }, name: 'ease in back' }, // 22
    { p0: [0.34, 1.56], p1: [0.64, 1], countFn: (t) => { const c1 = 1.70158; const c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }, name: 'ease out back' }, // 23
    { p0: [0.68, -0.6], p1: [0.32, 1.6], countFn: (t) => { const c1 = 1.70158; const c2 = c1 * 1.525; return t < 0.5 ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2 : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2; }, name: 'ease in out back' }, // 24
    { countFn(t) { const c4 = (2 * Math.PI) / 3; return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4); }, name: 'ease in elastic' }, // 25
    { countFn(t) { const c4 = (2 * Math.PI) / 3; return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1; }, name: 'ease out elastic' }, // 26
    { countFn(t) { const c5 = (2 * Math.PI) / 4.5; return t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2 : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1; }, name: 'ease in out elastic' }, // 27
    { countFn: t => 1 - easeTypes[28].countFn(t), name: 'ease in bounce' }, //28
    { countFn(t) { const n1 = 7.5625; const d1 = 2.75; if (t < 1 / d1) { return n1 * t * t; } else if (t < 2 / d1) { return n1 * (t -= 1.5 / d1) * t + 0.75; } else if (t < 2.5 / d1) { return n1 * (t -= 2.25 / d1) * t + 0.9375; } else { return n1 * (t -= 2.625 / d1) * t + 0.984375; } }, name: 'ease out bounce' }, //29
    { countFn: t => t < 0.5 ? (1 - easeTypes[28].countFn(1 - 2 * t)) / 2 : (1 + easeTypes[28].countFn(2 * t - 1)) / 2, name: 'ease in out bounce' }, // 30
];

export default class Ease {
    ease: Readonly<number>;

    constructor(ease: number | Ease) {
        if (ease instanceof Ease) {
            ease = ease.ease;
        }
        this.ease = ease || 0;
        this.check();
    }
    private check(): boolean {
        if (this.ease < 0) {
            this.ease = 0;
            return false;
        } else if (this.ease > 30) {
            this.ease = 30;
            return false;
        }

        return true;
    }
    set(id: number) {
        this.ease = id ?? 0;
        return this.check();
    }
    count(time: number, values: EaseResultArgs = [0, 1]): number {
        /**
         * @param time 时间
         * @param values 起始值与结束值, 起始值则默认时间为0~1
         * @description 计算缓动用的函数
         */
        if (values.length === 2) {
            values = [0, 1, ...values];
        }

        // 将 time 转为百分比，方便计算
        time = ((time - values[0]) / (values[1] - values[0])) || 0;

        // time超出范围直接返回
        if (time <= 0) return values[2];
        if (time >= 1) return values[3];

        // 获取缓动信息
        const easeInfo = easeTypes[this.ease];

        let result = easeInfo.countFn ? easeInfo.countFn(time) : Ease.countNormalEase(time, easeInfo.p0, easeInfo.p1);
        result = result * (values[3] - values[2]) + values[2];

        return result;
    }
    static countNormalEase(t: number, p0: Vec2, p1: Vec2): number {
        /**
         * @param time 时间 0~1
         * @description 计算三阶贝塞尔的通用函数
         */
        if (t <= 0) return 0;
        if (t >= 1) return 1;
        const progress = 1 - t;

        // 返回三阶贝塞尔计算结果
        // ! 公式有错
        return p0[0] * progress ** 3
            + 3 * p0[1] * t * progress ** 2
            + 3 * p1[0] * t ** 2 * progress
            + p1[1] * t ** 3;
    }
    static getEaseType(index: number): EaseTypeInfo | undefined {
        return easeTypes[index];
    }
}