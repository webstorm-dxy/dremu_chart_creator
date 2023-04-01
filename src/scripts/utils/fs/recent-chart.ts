import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";


export interface RecentChart {
    path: string;
    name: string;
    date: string;
}

export type RecentCharts = RecentChart[];


export async function getRecent() : Promise<RecentCharts>{
    function catchError() {
        writeTextFile('chart/recently.json', '[]', { dir: BaseDirectory.Resource });
        return [];
    }

    return await readTextFile('chart/recently.json', { dir: BaseDirectory.Resource })
        .then(v => {
            try {
                const json = JSON.parse(v);
                if (json instanceof Array) {
                    const files: RecentCharts = json.filter(v => (v.path && v.name && v.date));
                    return files;
                }
            } catch { return catchError(); }
        })
        .catch(catchError);
}

export async function setRecent(charts: RecentCharts) {
    return writeTextFile('chart/recently.json', JSON.stringify(charts), {dir: BaseDirectory.Resource});
}

export async function addRecent(_chart: Omit<RecentChart, 'date'>) {
    const chart: RecentChart = {..._chart, date: new Date().toUTCString()};
    const charts: RecentCharts = await getRecent();
    let newCharts: RecentCharts = [];
    const hadArr: Map<string, {date:string, index: number}> = new Map();

    charts.push(chart);

    // 去重
    for(let i = 0; i < charts.length; i++) {
        const chart: RecentChart = charts[i];
        const had = hadArr.get(chart.path);

        if(had) {
            const hadDate = new Date(had.date);
            const thisDate = new Date(chart.date);

            if (thisDate > hadDate) {
                newCharts[had.index] = chart;
                hadArr.set(chart.path, {date: chart.date, index: had.index});
            }
            continue;
        }
        newCharts.push(chart);
        hadArr.set(chart.path, {date: chart.date, index: i});
    }
    newCharts = newCharts.filter(v => v);

    return setRecent(newCharts);
}