import { app, BrowserWindow, ipcRenderer, } from 'electron';
const {ipcMain} = require('electron');

import Main from './main';
import { YouTubeService } from './googleapi/apiService';
import { eventHandlers } from './events';

//Create main window
Main.main(app, BrowserWindow)

Object.keys(eventHandlers)
	.forEach(name => {
		const fn = eventHandlers[name];
		ipcMain.on(name, fn);
	});

ipcMain.on('search-params', (event, params) => {
	YouTubeService.searchPlaylists(params)
		.then((res) => {
			console.log('sending... search-params-results')
			event.sender.send('search-params-results', {
				'status': 200,
				'params': params,
				'res': res
			})
		})
		.catch((err) => {
			event.sender.send('search-params-results', {
				'status':500,
				'res': err
			})
		})
})

ipcMain.on('login-cancelled', (event) => {
	Main.sendMessage('login-cancelled', null);
})