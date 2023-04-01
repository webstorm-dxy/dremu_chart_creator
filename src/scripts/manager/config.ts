import { AppConfigs, ValueSetOption } from "@/interfaces/manager/config";


// interface RuleConfig {
//     patten
// }

// type Path = string[] & [string];
// type Rule = RuleConfig | ((value: unknown) => RuleConfig);

// interface Config {
//     value: unknown;
//     rules?: Rule[];
// }

const defaultConfig: AppConfigs = {
    preview: { 
        speed: 10, 
        controls: true, 
        maxFPS: 30,
        minFPS: 0
    },
    'preview.controls': {showFPS: true,}
};

class Configs {
    private configs: AppConfigs;

    constructor(configs?: Partial<Configs['configs']>) {
        this.configs = { ...defaultConfig, ...configs };
        return new Proxy(this, {
            get(target, key) {
                if (target === this) {
                    return this.config;
                }
                return target[key];
            },
            set(target, key, newValue: ValueSetOption<AppConfigs>) {
                if (target === this) {
                    this.config = newValue;
                }
                target[key] = newValue;
                return true;
            }
        });
    }

    get config(): AppConfigs {
        return this.configs;
    }

    set config(newValue: ValueSetOption<AppConfigs>) {
        this.configs = newValue instanceof Function ? newValue(this.configs) : newValue;
    }

    get<T extends keyof AppConfigs>(key: T): AppConfigs[T] {
        return this.config[key];
    }

    set<T extends keyof AppConfigs>(key: T, newValue: ValueSetOption<AppConfigs[T]>): AppConfigs[T] {
        this.config = (prev) => { prev[key] = newValue instanceof Function ? newValue(prev[key]) : newValue; return prev; };
        return this.get(key);
    }
}

const config = new Configs();

export default config;