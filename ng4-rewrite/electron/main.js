"use strict";
exports.__esModule = true;
var Main = /** @class */ (function () {
    function Main() {
    }
    Main.onWindowAllClosed = function () {
        if (process.platform !== 'darwin')
            Main.application.quit();
    };
    Main.mainOnClose = function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        Main.mainWin = null;
    };
    Main.mainOnReady = function () {
        // this is a dependency we will have to live with
        // because we can't create BrowserWindow until
        // onReady fires.
        Main.mainWin = new Main.BrowserWindow({
            width: 1280,
            height: 720,
            'minWidth': 720,
            'minHeight': 640,
            'acceptFirstMouse': true
        });
        Main.mainWin.webContents.openDevTools();
        Main.mainWin.on('closed', Main.mainOnClose);
        require('electron-reload')(__dirname, {});
        Main.mainWin.loadURL('http://localhost:4200');
    };
    Main.main = function (app, browserWindow) {
        Main.BrowserWindow = browserWindow;
        Main.application = app;
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.mainOnReady);
    };
    Main.sendMessage = function (name, data) {
        Main.mainWin.webContents.send(name, data);
    };
    return Main;
}());
exports["default"] = Main;
