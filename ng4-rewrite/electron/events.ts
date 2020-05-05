import AuthService from './googleapi/authService';
import { YouTubeService, YoutubeApiService } from './googleapi/apiService';
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
	},
	[EventType.GET_PLIST_VIDEOS]: async (event, data) => {
		ReplyEvents.sendPlaylistVideos(data);
	},
	[EventType.PLAY_VIDEO]: (event, data) => {
		Main.createVideoWindow(data);
	},
	[EventType.UPDATE_TIME]: (event, data) => {
		Main.sendMessage(EventType.UPDATE_TIME, data);
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
		if (!list) list = await YouTubeService.getAccountPlaylists();
		Main.sendMessage(EventType.ACCOUNT_PLAYLISTS, list);
	},

	sendPlaylistVideos: async (data) => {
		const videos = await YouTubeService.getPlaylistVideos(data);
		Main.sendMessage(EventType.GET_PLIST_VIDEOS_REPLY, videos);
	}
}