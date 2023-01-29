import {BrowserWindow, BrowserWindowConstructorOptions} from 'electron';
import {Windows} from './window.d';
const windowConfigs =  require('../config/window');


// 所有窗口
const windows: Windows = {};

export function createWindow<K extends keyof Windows>(key: K, configs: BrowserWindowConstructorOptions={}) : Windows[K]{
    windows[key] = new BrowserWindow({
        ...windowConfigs.default,
        ...(windowConfigs[key] || {}),
        ...configs
    });
    
    return windows[key];
}

