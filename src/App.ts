import { app,BrowserWindow } from 'electron';
import Main from './Main';
const {ipcMain} = require('electron');

Main.main(app,BrowserWindow);

ipcMain.on('create-window', (event, id) => {
    Main.changeVideoId(id);
});

ipcMain.on('next-video', (event, args) => {
	console.log('next-video received');
	Main.mainWindow.webContents.send('load-next');
});

ipcMain.on('video-closed', (event, time) => {
	console.log('window closed');
	// send the time over to the playlistController.ts to 
	// see if enough of the video was watched or not.
	console.log(time);
});