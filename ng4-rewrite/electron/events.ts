import Main from './main';
import AuthService from './googleapi/authService';
import { YouTubeService } from './googleapi/apiService';


export const eventHandlers = {
	'login': async (event) => {
		console.log('login');
		await AuthService.createWindowIfNotAuth();
	}
}