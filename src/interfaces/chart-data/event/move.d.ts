import Ease from "@scripts/utils/ease";
import { Vec2 } from "@scripts/utils/vec/vec";
import {ChartSustainEventArgs } from "./event";

export interface ChartMoveEventArgs extends ChartSustainEventArgs{
    from: Vec2;
    to: Vec2;
    ease: Ease;
}