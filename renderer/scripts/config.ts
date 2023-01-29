import type { Configs, TempConfigs } from '../interfaces/config';


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
    // 获取配置
    const res = await fetch('/config/getUserConfig', {
        method: 'GET',
        mode: 'cors'
    }).then(res => res.json());

    // 尝试使用配置
    return new Promise((resolve, reject) => {
        if (res.code === 200 && res.msg === 'Success') {
            const userConfig: Configs = res.data;
            setConfigs(userConfig);
            resolve(userConfig);
            return;
        }
        reject();
    });
}

export async function saveConfigToUserConfig() {
    const configJson = JSON.stringify(config);
    window.localStorage.userConfig = configJson;

    // 保存配置
    const res = await fetch('/config/saveUserConfig', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: configJson
    }).then(res => res.json()).catch(err => { console.error(err); return err; });
}

export function initConfig(): void {
    config = defaultConfig;
    saveConfigToUserConfig();
}

function setConfigs(userConfig: Configs) {
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
    // config.devMode = true;
    // if (config.devMode) {
    // Config.setConfig('route', '/dist');
    // }
}

getUserConfig()
    .then(() => setConfig('devMode', false));
