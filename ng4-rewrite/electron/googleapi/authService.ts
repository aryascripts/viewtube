const {OAuth2Client} = require('google-auth-library');
const url = require('url');
const fs = require('fs');

import { BrowserWindow, ipcMain } from 'electron';
import { YouTubeService } from './apiService';
import {ReplyEvents} from './../events';


const SCOPES:string[] = [
		'https://www.googleapis.com/auth/youtube',
		'profile', 'email'
	];

const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
									process.env.USERPROFILE) + '/.viewtube/';
const TOKEN_PATH = TOKEN_DIR + 'token.json'

export default class AuthService {
	static authorized: boolean;
	static youtube:any;

	static async createWindowIfNotAuth() {
		try {
			const token = await this.loadFromFile();
			if (token) {
				this.setOauthCredentials(token, false);
			}
			else {
				this.createAuthWindow();
			}
		}
		catch (e) {
			this.createAuthWindow();
		}
	}

	static oAuth2Client:any = new OAuth2Client({
		clientId: '554340134389-g7v56ull5nd1f2q6s4khj7du7gu4novr.apps.googleusercontent.com',
		redirectUri: 'urn:ietf:wg:oauth:2.0:oob'
	});
	
	static authWin:BrowserWindow = null;
	
	static getOAuthClient() {
		if(this.authorized) {
			return this.oAuth2Client;
		}
		else {
			this.createAuthWindow();
			return 'not-authorized';
		}
	}

	static loadFromFile() {
		return new Promise((resolve, reject) => {
			fs.readFile(TOKEN_PATH, (err, token) => {
				if (err) {
					reject(err);
				} else {
					resolve(JSON.parse(token));
				}
			});
		});
	}

	static getAuthUrl(client) {
		// Generate the url that will be used for the consent dialog.
		return this.oAuth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: SCOPES
		});
	}

	//authorization popup and events/url navigation
	static createAuthWindow() {
		if(this.authWin) return; //window already exists.
		this.storeToken(''); // clear token
		this.authWin = new BrowserWindow({
			width: 600,
      height: 750,
      minWidth: 400,
      minHeight: 600,
      acceptFirstMouse: true,
      alwaysOnTop: true //cannot escape
		});

		this.authWin.loadURL(this.getAuthUrl(this.oAuth2Client), {
			userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) old-airport-include/1.0.0 Chrome Electron/7.1.7 Safari/537.36'
		});
		this.authWin.on('closed', this.onClose.bind(this));

		//detects when the user has completed authorization
		this.authWin.webContents.on('did-navigate', (event, url) => {
			this.handleNavigate(url); //url of the window
		});
	}

	static onClose() {
		this.authWin = null;
		ipcMain.emit('login-cancelled');
		console.log('Authorization was cancalled by user.');
	}

	static async handleNavigate(newUrl:string) {
		const parsed = url.parse(newUrl, true);
		
		if(parsed) {
			if(parsed.error) { //unknown error
				console.log(`Error: ${parsed.error}`)
				return
			}
			else if(parsed.query.response == 'error=access_denied') {
				console.log('Authorization was cancelled.')
				this.authWin.close();
				return
			}
			//approval code exists - authorization is complete.
			//Get and store refresh tokens
			const appCode = parsed.query.approvalCode;
			if(appCode) {
				let tk = await this.getToken(appCode);
				this.setOauthCredentials(tk.tokens);
			}
		}
	}

	private static setOauthCredentials(tokens, store:boolean = true) {
		if(store) 
			this.storeToken(tokens);
		this.oAuth2Client.setCredentials(tokens);
		if (this.oAuth2Client.isTokenExpiring()) {
			this.oAuth2Client.refreshToken(tokens.refresh_token)
				.catch(err => {
					console.log('failed refresh');
					this.authorized = false;
					this.createAuthWindow();
					ReplyEvents.sendUsername('Sign In With Google')
				});
		}
		YouTubeService.client = this.oAuth2Client;
		// TODO - make this one dynamic from jtw
		ReplyEvents.sendUsername('Aman Bhimani')
	}

	static async getToken(code:string) {
			const token = await this.oAuth2Client.getToken(code);
			if(token.res.status === 200) {
				this.authWin.removeAllListeners('closed');
				this.authWin.close();
				return token;
			}
			else {
				console.error('There was an error receiving authentication tokems from Google.' + token);
				return null;
			}
	}

	private static storeToken(token: any) {
		try {
			fs.mkdirSync(TOKEN_DIR);
		} catch (err) {
			if (err.code != 'EEXIST') {
				throw err;
			}
		}
		
		fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
			if (err) throw err;
		});
		console.log('Token stored to ' + TOKEN_PATH);
	}
}