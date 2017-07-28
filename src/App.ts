import { app,BrowserWindow } from 'electron';
import Main from './Main';
const {ipcMain} = require('electron');

var i = 0;

Main.main(app,BrowserWindow);

ipcMain.on('create-window', (event, video) => {
    Main.changeVideoId(video);
});

ipcMain.on('next-video', (event, data) => {
	Main.mainWindow.webContents.send('load-next', data);
});

ipcMain.on('video-closed', (event, data) => {
	// console.log('window closed');
	Main.mainWindow.webContents.send('calc-watch-time', data)
});

ipcMain.on('always-on-top', (event, data) => {
	// console.log('received event always on top');
	Main.setAlwaysOnTop(data);
});

ipcMain.on('close-video', (event, data) => {
	Main.closeVideoWindow();
});

ipcMain.on('restart-app', (event, data) => {
	Main.application.relaunch();
	Main.application.quit();
});

ipcMain.on('close-app', (event, data) => {
	Main.application.quit();
});

ipcMain.on('sort-playlists', (event, data) => {
	Main.mainWindow.webContents.send('sort-playlists');
});

ipcMain.on('config-loaded', (event, data) => {
	Main.mainWindow.webContents.send('config-loaded');
});