import Ease from "@scripts/utils/ease";
import {ChartSustainEventArgs } from "./event";

export interface ChartRotateEventArgs extends ChartSustainEventArgs{
    from: number;
    to: number;
    ease: Ease;
}