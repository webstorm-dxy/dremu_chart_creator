/* eslint-disable camelcase */
import { ChartAecFile } from "@/interfaces/chart-data/aecFile";
import u2_0 from './2.1';

const upgradeFns: Record<number, (data: ChartAecFile) => ChartAecFile> = {2.0: u2_0,};

export default function upgrade(data: ChartAecFile): Promise<ChartAecFile> {
    return new Promise<ChartAecFile>((resolve, reject) => {
        const upgradeFn = upgradeFns[data.meta.version];
        
        if(!upgradeFn) reject(new Error(`Upgrade ${data.meta.version} to next failed. Error: Can't find upgrade function. `));

        resolve(upgradeFn(data)); 
    });
}