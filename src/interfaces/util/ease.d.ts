/* eslint-disable no-unused-vars */


export type EasePointInfo = Vec2;

export interface EaseTypeInfo{
    countFn?: (time: number) => number | undefined;
    p0?: EasePointInfo;
    p1?: EasePointInfo;
    name: string;
}

type startTime = number;
type endTime = number;
type startValue = number;
type endValue = number;
export type EaseResultArgs = [startValue, endValue] | [startTime, endTime, startValue, endValue];