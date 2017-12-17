import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';

export default class Main {
    static mainWindow: Electron.BrowserWindow;
    static videoWindow: Electron.BrowserWindow;

    static application: Electron.App;
    static BrowserWindow;

    static alwaysontop = false;

    static onWindowAllClosed() {
        if (process.platform !== 'darwin')
            Main.application.quit();
    }
    static onClose(){
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        Main.mainWindow = null;        
    }
    static onReady(){
        // this is a dependency we will have to live with
        // because we can't create BrowserWindow until
        // onReady fires.
        Main.mainWindow = new Main.BrowserWindow({
            show: false,
            width: 1280,
            height: 720,
            'minWidth': 720,
            'minHeight': 640,
            'acceptFirstMouse': true,
            'titleBarStyle': 'hidden'
        });
        
        Main.mainWindow.loadURL('file://' + __dirname + '/index.html');
        Main.mainWindow.on('closed', Main.onClose);
        Main.mainWindow.once('ready-to-show', () => {
            Main.mainWindow.show();
        });
    }
    static main(app: Electron.App, browserWindow: typeof BrowserWindow){
        Main.BrowserWindow = browserWindow;
        Main.application = app;
        Main.application.on('window-all-closed',Main.onWindowAllClosed);
        Main.application.on('ready', Main.onReady);
    }

    static createVideoWindow(video) {

        console.log('video id: ' + video.id );
        Main.videoWindow = new BrowserWindow({
            show: false,
            width: 750,
            height: 530,
            'minWidth': 720,
            'minHeight': 100,
            'acceptFirstMouse': true,
            'titleBarStyle': 'hidden',
            'alwaysOnTop': Main.alwaysontop
        });

        Main.videoWindow.once('ready-to-show', () => {
            Main.videoWindow.show();
        });

        Main.videoWindow.on('closed', () => {
            Main.videoWindow = null;
        });

        Main.videoWindow.webContents.on('new-window', function(e, url) {
          e.preventDefault();
          require('electron').shell.openExternal(url);
        });

        Main.changeVideoId(video);
    }

    static closeVideoWindow() {
        console.log('closing window...');
        if(Main.videoWindow !== null) {
            Main.videoWindow.close();
        }
    }

    static changeVideoId(video) {
        if(!Main.videoWindow) {
            Main.createVideoWindow(video);
            return;
        }
        
        Main.videoWindow.loadURL('file://' + __dirname + '/index.html#/video/'+video.id+'/'+video.time);
    }

    static setAlwaysOnTop(value) {
        Main.alwaysontop = value;
        if(Main.videoWindow) {
            Main.videoWindow.setAlwaysOnTop(value);
        }
    }
}