import {BrowserWindow} from 'electron';

export type Windows = Record<Exclude<string|symbol, 'default'>, BrowserWindow>;