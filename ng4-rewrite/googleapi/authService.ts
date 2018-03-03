const {OAuth2Client} = require('google-auth-library');
import { app, BrowserWindow } from 'electron';
const http = require('http');
const url = require('url');
const querystring = require('querystring');
const opn = require('opn');
import { authKeys } from './auth';

export default class AuthService {
	static SCOPES:string[] = [
		'https://www.googleapis.com/auth/youtube',
		'https://www.googleapis.com/auth/youtube.readonly',
		'https://www.googleapis.com/auth/youtube.upload'
	];
	static oAuth2Client:any = new OAuth2Client(
		authKeys.client_id,
		authKeys.client_secret,
		authKeys.redirect_uris[0]
	);
	static authWin:BrowserWindow = null;
	
	static getAuthUrl(client) {
		// Generate the url that will be used for the consent dialog.
		return this.oAuth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: this.SCOPES
		});
	}

	static createAuthWindow() {
		if(this.authWin) return; //window already exists.
		this.authWin = new BrowserWindow({
			width: 600,
      height: 750,
      'minWidth': 400,
      'minHeight': 600,
      'acceptFirstMouse': true,
      alwaysOnTop: true
		});
		this.authWin.loadURL(this.getAuthUrl(this.oAuth2Client));
		this.authWin.on('closed', this.onClose);
	}

	static onClose() {
		this.authWin = null;
	}
}