import { ChartSustainEventArgs } from "@interfaces/chart-data/event/event.d";
import Ease from "@scripts/utils/ease";
import {  Vec4 } from "@scripts/utils/vec/vec";

export interface ChartColorEventArgs extends ChartSustainEventArgs{
    from: Vec4;
    to: Vec4;
    ease: Ease;
}