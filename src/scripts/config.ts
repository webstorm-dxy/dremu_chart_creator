export interface IConfigs {
    api: {
        /* dev */
        login: string;
        checkToken: string;

    }
}

const configs: IConfigs = {
    api: {
        /* dev */
        login: '/api/login',
        checkToken: '/api/checkToken',
        // login: 'https://api.vestar.games',
        // checkToken: 'https://api.vestar.games',
    }
};

const globalConfigs: Readonly<IConfigs> = new Proxy(configs, {
    set: () => false,
    get: (target, p) => target[p]
});
export default globalConfigs;