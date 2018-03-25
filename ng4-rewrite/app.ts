import { app, BrowserWindow, ipcRenderer, } from 'electron';
const {ipcMain} = require('electron');

import Main from './main';
import AuthService from './googleapi/authService';
import { YoutubeApiService } from './googleapi/apiService';

var youtube:YoutubeApiService = null

//Create main window
Main.main(app, BrowserWindow)

//Check for stored tokens
AuthService.loadFromFile()
.then(createYoutubeService)
.catch((err) => {
	console.log('tokens not on file')
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
	console.log('get-account-plalists')
	getAccountPlaylists(nextPage)
		.then(resp => {
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

function createYoutubeService(client) {
	if(!youtube) youtube = new YoutubeApiService(client)
	return Promise.resolve(youtube)
}

function getAccountPlaylists(nextPage: string = null) {
	console.log('get-account-playlists')
	if(!youtube) {
		ipcMain.emit('authorize')
	}

	return youtube.getAccountPlaylists(nextPage)
}