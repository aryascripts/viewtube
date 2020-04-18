import Main from './main';

export const eventHandlers = {

}


export function sendNewClientCreds(credentials) {
	Main.sendMessage('oauth2-client', credentials);
}