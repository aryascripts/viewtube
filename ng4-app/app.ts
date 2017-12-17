/*
	This file manages the main NODE server process.
	Any events that Node needs to receive, and send happen here.
	Electron is responsible for talking with the server managed in this file.
	"Main" window is spawned from this node server. 
*/

import { app,BrowserWindow } from 'electron';
import Main from './Main';
// import ElectronService from './src/app/providers/electron.service';
const {ipcMain} = require('electron');

var i = 0;

Main.main(app,BrowserWindow);

ipcMain.on('create-window', (event, video) => {
    console.log('Changing video.')
    Main.changeVideoId(video);
});

ipcMain.on('next-video', (event, data) => {
	console.log('Loading next video')
	Main.mainWindow.webContents.send('load-next', data);
});

ipcMain.on('video-closed', (event, data) => {
	console.log('window closed');
	console.log(data);
	Main.mainWindow.webContents.send('calc-watch-time', data)
});

ipcMain.on('always-on-top', (event, data) => {
	console.log('received event always on top');
	Main.setAlwaysOnTop(data);
});

ipcMain.on('close-video', (event, data) => {
	console.log('Closing video');
	Main.closeVideoWindow();
});

ipcMain.on('restart-app', (event, data) => {
	console.log('Restarting application.')
	Main.application.relaunch();
	Main.application.quit();
});

ipcMain.on('close-app', (event, data) => {
	console.log('Closing application.');
	Main.application.quit();
});

ipcMain.on('sort-playlists', (event, data) => {
	console.log('Sorting playlists');
	Main.mainWindow.webContents.send('sort-playlists');
});

ipcMain.on('config-loaded', (event, data) => {
    console.log('Config was loaded.');
    Main.mainWindow.webContents.send('config-loaded');
})

ipcMain.on('playlists-loaded', (event, data) => {
    console.log('playlists loaded. going to /home');
    Main.mainWindow.webContents.send('load-home');
})
