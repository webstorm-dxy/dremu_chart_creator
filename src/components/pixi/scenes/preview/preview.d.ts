import {SceneProps} from '../../scene/scene';
import type {ChartData} from '@scripts/chart-data/chart-data';


export interface PreviewSceneProps extends Omit<SceneProps, 'name'|'viewWidth'|'viewHeight'> {
    chart: ChartData;
    time: number;
    options?: Partial<PreviewOptions & PreviewControls>;
}

export interface PreviewOptions {
    speed: number;
    controls: boolean;
    maxFPS: number;
    minFPS: number;
}

export interface PreviewControls {
    showFPS: boolean;
}