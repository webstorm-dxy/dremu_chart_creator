export interface EditorConfigs{
    path: string;
}

export interface EditorContext{
    editorConfigs: EditorConfigs;
    chart: ChartData|undefined;
    musicUrl: string,
    setEditorConfigs: Function;
    setChart: Function;
    setMusicUrl: Function;
}