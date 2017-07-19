import { app,BrowserWindow } from 'electron';
import Main from './Main';
const {ipcMain} = require('electron');

Main.main(app,BrowserWindow);

ipcMain.on('create-window', (event, video) => {
    Main.changeVideoId(video);
});

ipcMain.on('next-video', (event, args) => {
	console.log('next-video received');
	Main.mainWindow.webContents.send('load-next');
});

ipcMain.on('video-closed', (event, time) => {
	console.log('window closed');
	Main.mainWindow.webContents.send('calc-watch-time', { 'time':Math.floor(time) });
});