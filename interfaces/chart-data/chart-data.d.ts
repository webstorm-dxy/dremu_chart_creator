export interface ChartDataArgs{
    meta: Meta;
    data: Data;
}

export interface Meta{
    name: string;
}

export interface Data{
    lines: ChartLine[] & [ChartLine];
}