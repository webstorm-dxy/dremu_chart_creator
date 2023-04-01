import Ease from "@scripts/utils/ease";
import {ChartSustainEventArgs } from "./event";

export enum MoveTypes {
    X,
    Y
}

export type IMove = number;
export interface ChartMoveEventArgs extends ChartSustainEventArgs{
    from: IMove;
    to: IMove;
    ease: Ease;
}