import {SceneProps} from '../../scene/scene.d';
import type {ChartData} from '@scripts/chart-data/chart-data';


export interface PreviewSceneProps extends Omit<SceneProps, 'name'> {
    chart: ChartData;
}