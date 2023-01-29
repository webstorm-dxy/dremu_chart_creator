"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var window_1 = require("./manager/window");
// import NextJsProcess from './manager/next-js/process';
// import DEVMODE from './config/devmode';
function quit() {
    electron_1.app.quit();
}
electron_1.app.on('ready', function () {
    // NextJsProcess.start(DEVMODE);
    var mainWindow = (0, window_1.createWindow)('main');
    mainWindow.loadURL('http://localhost:8888/');
    mainWindow.on('close', function () {
        quit();
    });
});
electron_1.app.on('window-all-closed', quit);
//# sourceMappingURL=main.js.map