import { Injectable } from '@angular/core';
import { AppElectronService } from './electron.service';

@Injectable()
export class GoogleApiService {

	constructor(private electronService: AppElectronService) {
		this.createListeners();

		this.electronService.ipcRenderer.send('check-client');
	}

	createListeners() {
		this.electronService.ipcRenderer.on('my-playlists', (sender, resp) => {
			console.log(resp);
			// this.playlistService.addAccountPlaylists(resp);
		});

		//After client creation, need to get the account playlists
		this.electronService.ipcRenderer.on('client-created', () => {
			console.log('received: client-created');
			this.getMyPlaylists();
		});

		this.electronService.ipcRenderer.on('check-client', (event, clientExists) => {
			if(clientExists)
				this.getMyPlaylists()
		})
	}

	getMyPlaylists(nextPage:string = null) {
		this.electronService.ipcRenderer.send('get-account-playlists', nextPage);
	}

	login() {
		this.electronService.ipcRenderer.send('authorize');
	}
}