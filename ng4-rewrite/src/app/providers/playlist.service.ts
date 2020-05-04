import { Injectable, Inject} from '@angular/core';
import { Playlist, PlaylistType } from '../models/Playlist';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { AppElectronService } from './electron.service';
import { EventType } from '../models/Events';
import { DataStoreService } from './data-store.service';

@Injectable()
export class PlaylistsService {

	public myPlaylists: BehaviorSubject<Playlist[]>;
	public customPlaylists: BehaviorSubject<Playlist[]>;
	public myName: ReplaySubject<string>;

	constructor(
		private electronService: AppElectronService,
		private database: DataStoreService
		) {
		this.myPlaylists = new BehaviorSubject([]);
		this.customPlaylists = new BehaviorSubject([]);
		this.myName = new ReplaySubject(1);

		this.electronService.listen(EventType.ACCOUNT_PLAYLISTS, this.addAccountPlaylists.bind(this));
		this.getCustomPlaylists();
	}

	addAccountPlaylists(event: any, resp: any) {
		console.log('account playlists', resp);
		//TODO: Check for nulls and error responses better in the future
		if(resp.status != 200 || resp.data.pageInfo.resultsPerPage <= 0) {
			console.error('Error. We were unable to receive data from YouTube.', resp);
			return;
		}

		const lists:{} = resp['data']['items'];
		let plists: Playlist[] = [];
		Object.entries(lists).forEach(
			([key, info]) => {
				plists.push(Playlist.fromPlaylistsList(info));
			});
			this.myPlaylists.next(plists);
	}

	addCustomPlaylist(playlist: Playlist) {
		if (!this.customPlaylists.value.some(p => playlist.id === p.id)) {
			this.database.savePlaylist(playlist, PlaylistType.CUSTOM);
			this.customPlaylists.next([...this.customPlaylists.value, playlist]);
		}
	}

	async getCustomPlaylists() {
		const playlists = (await this.database.getCustomPlaylists())
												.map(item => new Playlist(item));
		this.customPlaylists.next(playlists);
	}

	getCachedPlaylistById(id: string): Playlist {
		return this.myPlaylists.value.find(p => p.id === id) ||
					 this.customPlaylists.value.find(p => p.id === id);
	}
}