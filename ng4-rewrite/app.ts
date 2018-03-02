import { app, BrowserWindow, } from 'electron';
import Main from './main';
const {ipcMain} = require('electron');

Main.main(app, BrowserWindow);

ipcMain.on('openAuthWindow', (event, url) => {
	Main.openAuthWindow(url);
});