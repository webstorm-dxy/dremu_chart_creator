/* eslint-disable no-unused-vars */
import { Vec2 } from "@scripts/utils/vec/vec";

export type EasePointInfo = Vec2;

export interface EaseTypeInfo{
    countFn?: (time: number) => number | undefined;
    p0?: EasePointInfo;
    p1?: EasePointInfo;
    name: string;
}

type startValue = number;
type endValue = number;
export type EaseResultArgs = [startValue, endValue] & Vec2;