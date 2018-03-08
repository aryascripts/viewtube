import { app, BrowserWindow, ipcRenderer, } from 'electron';
const {ipcMain} = require('electron');

import Main from './main';
import AuthService from './googleapi/authService';
import { YoutubeApiService } from './googleapi/apiService';

var youtube:YoutubeApiService = null;

//Create main window
Main.main(app, BrowserWindow);

//Send signal to authorize client
ipcMain.on('authorize', (event) => {
	console.log('authorize');
	AuthService.createAuthWindow();
	this.authEvent = event;
});

ipcMain.on('create-youtube-service', (client) => {
	console.log('create-youtube-service');
	youtube = new YoutubeApiService(client);
	Main.mainWin.webContents.send('client-created');
});

ipcMain.on('get-account-playlists', (event, nextPage:string = null) => {
	console.log('get-account-playlists');
	if(!youtube) {
		ipcMain.emit('authorize');
		return;
	}

	youtube.getAccountPlaylists(nextPage)
		.then((resp:any) => {
			event.sender.send('my-playlists', resp);
		})
		.catch((err: any) => {
			console.log(err);
		});
});