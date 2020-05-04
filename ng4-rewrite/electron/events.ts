import AuthService from './googleapi/authService';
import { YouTubeService } from './googleapi/apiService';
import Main from './main';
import {EventType} from './../src/app/models/Events';

export const eventHandlers = {
	[EventType.LOGIN]: async () => {
		await AuthService.createWindowIfNotAuth();
	},
	[EventType.SEARCH]: async (event, data) => {
		console.log(event, data);
		const lists = await YouTubeService.searchPlaylists(data);
		ReplyEvents.sendPlaylists(lists);
	},
	[EventType.ACCOUNT_PLAYLISTS]: (event, data) => {
		ReplyEvents.sendAccountPlaylists();
	}
}

export const ReplyEvents = {

	sendPlaylists: (playlists) => {
		Main.sendMessage(EventType.SEARCH_REPLY, playlists);
	},
	
	sendUsername: (name: string) => {
		Main.sendMessage(EventType.USERS_NAME, name);
	},

	sendAccountPlaylists: async (list?: any) => {
		console.log('sending account playlists...');
		if (!list) list = await YouTubeService.getAccountPlaylists();
		Main.sendMessage(EventType.ACCOUNT_PLAYLISTS, list);
	}
}