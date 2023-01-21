import Ease from "@scripts/utils/ease";
import { ChartEventArgs } from "./event";

export interface ChartDotEventArgs extends ChartEventArgs{
    position: number
    ease: Ease;
    move?: null;
    alpha?: null;
}