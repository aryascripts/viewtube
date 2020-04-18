import AuthService from './googleapi/authService';
import { YoutubeService } from './googleapi/apiService';
const {ipcMain} = require('electron');
import Main from './main';

export const eventHandlers = {

	'authorize': (event) => {
		console.log('authorize')
		AuthService.createAuthWindow()
	},

	'create-youtube-service': (client) => {
		console.log('create-youtube-service')
		createYoutubeService(client)
		.catch(err => {
			console.log(err);
		})
	}
	
}

export function createYoutubeService(client) {
	YoutubeService.setClient(client);
	return Promise.resolve(YoutubeService);
}