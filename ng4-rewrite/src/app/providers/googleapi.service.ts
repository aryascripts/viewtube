import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import PlaylistsService from './playlist.service';

@Injectable()
export class GoogleApiService {

	constructor(private electronService: ElectronService,
							private playlistService: PlaylistsService) {
		this.createListeners();
	}

	createListeners() {
		console.log('creating listeners in GoogleApiService');
		this.electronService.ipcRenderer.on('my-playlists', (sender, resp) => {
			this.playlistService.addAccountPlaylists(resp);
		});

		this.electronService.ipcRenderer.on('client-created', (sender) => {
			this.getMyPlaylists();
		});
	}

	getMyPlaylists(nextPage:string = null) {
		this.electronService.ipcRenderer.send('get-account-playlists', nextPage);
	}

	login() {
		this.electronService.ipcRenderer.send('authorize');
	}
}