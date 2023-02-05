import type { Configs, TempConfigs } from '../interfaces/config';
import {BaseDirectory, writeTextFile, readTextFile} from '@tauri-apps/api/fs';


// 配置的版本，用于排除或更新
const version = 1.0;
const defaultConfig: Configs | undefined = require('@json/defaultConfig.json');

// 制谱器临时配置
// eslint-disable-next-line prefer-const
export let tempConfig: TempConfigs = {
    editing: { lineId: 0 },
    referenceLineAlign: true,
    numOfMinor: 4
};
// 总配置，仅可单次实例化
let config: Configs = defaultConfig;



// * 获取配置
export function getConfig<k extends keyof Configs>(name?: k): Configs[k] {
    return config[name];
}
// * 获取全部配置
export function getConfigs(): Configs {
    return config;
}
// * 设置配置
export function setConfig<k extends keyof Configs>(name: k, value: Configs[k]) {
    if (value === undefined) { return config[name]; }
    config[name] = value;

    saveConfigToUserConfig();

    return config[name];
}



async function getUserConfig() {
    const content = await readTextFile('config/userConfig.json', {dir: BaseDirectory.Resource}).then(content => JSON.parse(content));
    console.log(content);
    return content;
}

export async function saveConfigToUserConfig() {
    const configJson = JSON.stringify(config);
    // window.localStorage.userConfig = configJson;

    // 保存配置
    await writeTextFile('config/userConfig.json', configJson, {dir: BaseDirectory.Resource});
}

export function initConfig(): void {
    config = defaultConfig;
    saveConfigToUserConfig();
}

export function setConfigs(userConfig: Configs) {
    if (userConfig) {
        try {
            config = {
                ...defaultConfig,
                ...config,
                ...userConfig
            };
            if (config.version < version) {
                config = {
                    ...defaultConfig,
                    ...config,
                    version: defaultConfig.version || version
                };
            }
        } catch (e) {
            initConfig();
        }
    } else {
        initConfig();
    }
}

getUserConfig()
    .then(() => setConfig('devMode', false));
// setConfig('devMode', true);