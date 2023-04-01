import {SceneProps} from '../../scene/scene';
import type {ChartData} from '@scripts/chart-data/chart-data';
import { RefObject } from 'react';


export interface PreviewSceneProps extends Omit<SceneProps, 'name'|'viewWidth'|'viewHeight'> {
    chart: ChartData;
    audio: RefObject<HTMLAudioElement>;
    options: Partial<PreviewOptions & PreviewControls>;
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