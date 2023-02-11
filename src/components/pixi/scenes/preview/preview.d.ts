import {SceneProps} from '../../scene/scene';
import type {ChartData} from '@scripts/chart-data/chart-data';
import { RefObject } from 'react';


export interface PreviewSceneProps extends Omit<SceneProps, 'name'|'viewWidth'|'viewHeight'> {
    chart: ChartData;
    audio: RefObject<HTMLAudioElement>;
    disableScale?: boolean; 
}