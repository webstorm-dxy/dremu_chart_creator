import { BrowserWindowConstructorOptions } from "electron";

const configs: Record<string|symbol, BrowserWindowConstructorOptions> = {
    default: {
        width: 1280,
        height: 720,
        maxWidth: 1920,
        maxHeight: 1080,
        title: "Re: AstEdit",
        webPreferences: {webSecurity: false}
    },
    main: {
        width: 1280,
        height: 720,
        title: "Re: AstEdit",
        fullscreenable: true,
    }
};
module.exports = configs;