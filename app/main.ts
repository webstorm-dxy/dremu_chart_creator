import { app } from 'electron';
import { createWindow } from './manager/window';
// import NextJsProcess from './manager/next-js/process';
// import DEVMODE from './config/devmode';


function quit() {
    app.quit();
    
}

app.on('ready', () => {
    // NextJsProcess.start(DEVMODE);
    const mainWindow = createWindow('main');

    mainWindow.loadURL('http://localhost:8888/');

    mainWindow.on('close', () => {
        quit();
    });
});

app.on('window-all-closed', quit);