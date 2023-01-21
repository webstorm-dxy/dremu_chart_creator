import type { Configs, TempConfigs } from '../interfaces/config';


const version = 1.0;
const defaultConfig: Configs | undefined = require('@json/defaultConfig.json');
// eslint-disable-next-line prefer-const
export let tempConfig: TempConfigs = {
    editing: { lineId: 0 },
    referenceLineAlign: true,
    numOfMinor: 4
};
let config: Configs = defaultConfig;
let userConfig: Configs = defaultConfig;

export function getConfig<k extends keyof Configs>(name?: k): Configs[k] {
    return config[name];
}
export function getConfigs(): Configs {
    return config;
}
export function setConfig<k extends keyof Configs>(name: k, value: Configs[k]) {
    if (value === undefined) { return config[name]; }
    config[name] = value;

    saveConfigToUserConfig();

    return config[name];
}

async function getUserConfig() {
    const res = await fetch('http://127.0.0.1:7628/config/getUserConfig', {
        method: 'GET',
        mode: 'cors'
    }).then(res => res.json());

    return new Promise((resolve, reject) => {
        if (res.code === 200 && res.msg === 'Success') {
            userConfig = res.data;
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
