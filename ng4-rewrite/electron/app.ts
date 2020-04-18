import { app, BrowserWindow, ipcRenderer, } from 'electron';
const {ipcMain} = require('electron');

import Main from './main';
import AuthService from './googleapi/authService';
import { YoutubeService } from './googleapi/apiService';

//Create main window
Main.main(app, BrowserWindow)

//Check for stored tokens
AuthService.loadFromFile()
.then(createYoutubeService)
.catch((err) => {
	console.log('tokens not on filez')
})

//Send signal to authorize client
ipcMain.on('authorize', (event) => {
	console.log('authorize')
	AuthService.createAuthWindow()
})

ipcMain.on('create-youtube-service', (client) => {
	console.log('create-youtube-service')
	createYoutubeService(client)
	.then(resp => {
		return getAccountPlaylists()
	})
	.then(resp => {
		Main.sendMessage('my-playlists', resp);
	})
	.catch(err => {
		console.log(err);
	})
});

ipcMain.on('get-account-playlists', (event, nextPage:string = null) => {
	console.log('get-account-playlists')
	getAccountPlaylists(nextPage)
		.then(resp => {
			console.log('sending... my-playlists')
			event.sender.send('my-playlists', resp)
		})
		.catch(err => {
			console.log(err)
		})
})

ipcMain.on('check-client', (event) => {
	let val:boolean = youtube ? true : false
	event.sender.send('check-client', val)
})

ipcMain.on('search-params', (event, params) => {
	youtube.searchPlaylists(params)
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

function createYoutubeService(client) {
	YoutubeService.setClient(client);
	return Promise.resolve();
}

function getAccountPlaylists(nextPage: string = null) {
	return YoutubeService.getAccountPlaylists(nextPage)
}