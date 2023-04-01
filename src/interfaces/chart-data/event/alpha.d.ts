import { ChartSustainEventArgs } from "@interfaces/chart-data/event/event.d";
import Ease from "@scripts/utils/ease";

/**
 * @description 透明度参数
 */
export type IAlpha = number;

export interface ChartAlphaEventArgs extends ChartSustainEventArgs{
    from: IAlpha;
    to: IAlpha;
    ease: Ease;
}