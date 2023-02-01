export interface Configs {
    version: number;
    maxHistoryLength: number;
    backgroundProcess: boolean;
    route: string;
    devMode: boolean;
    referenceLineWidth: number;
    referenceLineNumPosition: 'top' | 'middle' | 'bottom';
    overflowBeats: number;
    runtimeType: 'web' | 'local' | 'dev';
    connectCheckTime: number;
    reConnectTime: number;
    autoSaveChartTime: number;
    sound: string;
    maxFPS: number;
    lowResolution: boolean;
    compatibilityMode: boolean;
    windowSize: {
        width: 1280,
        height: 720,
    }
    hotkeys: {
        undo: string,
        redo: string,
        editTool: {
            tap: string,
            drag: string,
            flick: string,
            hold: string,
            delete: string
        },
        mouse: string
    };
}

export interface TempConfigs {
    canPreview?: boolean;
    editing: {
        lineId: number;
    }
    numOfMinor: number;
    referenceLineAlign: boolean;
}

interface SetConfigArgs<k extends keyof Configs> {
    key: k;
    value: Configs[k];
}