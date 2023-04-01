import { PreviewControls } from "@/components/pixi/scenes/preview/preview.d";
import { PreviewOptions } from "@/components/pixi/scenes/preview/preview.d";

export interface AppConfigs {
    preview: PreviewOptions;
    'preview.controls': PreviewControls;
}

export type ValueSetOption<T> = T | ((prev: T) => T);