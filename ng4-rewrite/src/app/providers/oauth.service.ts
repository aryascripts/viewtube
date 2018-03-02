import { Injectable } from '@angular/core';
import { auth } from './auth';
import { ElectronService } from './electron.service';
// const google = require('googleapis');
// const googleAuth = require('google-auth-library');

@Injectable()
export class OAuthService {

	//NOTE: Everything with oauth needs to run in the node process, not angular.
	//Use renderer events to connect to the node processes.

	// SCOPES:string[] = [
	// 	'https://www.googleapis.com/auth/youtube',
	// 	'https://www.googleapis.com/auth/youtube.readonly',
	// 	'https://www.googleapis.com/auth/youtube.upload'
	// ];

	// keys:any = auth;
	// token:any;
	// OAuth2:any = google.auth.OAuth2;
	// oauth2Client: any;

	// constructor(private electornService:ElectronService) { }

	authorize() {
	// 	let clientSecret = this.keys.client_secret;
  // 	let clientId = this.keys.client_id;
 	// 	let redirectUrl = this.keys.redirect_uris[0];
  // 	let auth = new googleAuth();
  // 	this.oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

	// 	if(!this.token) 
	// 		this.openAuthPage();
	// 	else
	// 		this.oauth2Client.credentials = JSON.parse(this.token);
	}

	// openAuthPage() {
	// 	var authUrl = this.oauth2Client.generateAuthUrl({
	// 		access_type: 'offline',
	// 		scope: this.SCOPES
	// 	});
	// 	this.electornService.ipcRenderer.send('openAuthWindow', authUrl);

	// }

	// getNewToken(code) {
	// 	return new Promise((resolve, reject) => {
	// 		this.oauth2Client.getToken(code, function(err, token) {
	// 			if (err) {
	// 				reject(err);
	// 			}
	// 			this.oauth2Client.credentials = token;
	// 			resolve(token);
	// 		});
	// 	})

	// }

}