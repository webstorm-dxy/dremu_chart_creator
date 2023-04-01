import { ChartThemeEventArgs, ITheme, Themes } from "@/interfaces/chart-data/event/theme.d";
import { ChartEvent, SustainEvent } from "./event";
import Fraction from "fraction.js";

@SustainEvent
export default class ChartThemeEvent extends ChartEvent {
    from: ITheme;
    to: ITheme;
    
    // @SustainEvent
    endTime: Fraction;

    constructor(args: ChartThemeEventArgs) {
        super(args);
        this.from = args.from || Themes.DEFAULT;
        this.to = args.to || Themes.DEFAULT;
    }
}