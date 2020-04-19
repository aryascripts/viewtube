import AuthService from './googleapi/authService';
import { YouTubeService } from './googleapi/apiService';
import Main from './main';

export const eventHandlers = {
	'login': async () => {
		try {
			await AuthService.createWindowIfNotAuth();
		} catch (e) {
			console.log('ignore error', e)
		}
	},
	'search-playlists': async (event, data) => {
		console.log(event, data);
		const lists = await YouTubeService.searchPlaylists(data);
		Main.sendMessage('search-playlists-reply', lists);
	}
}