import { Injectable, Inject} from '@angular/core';
import { Playlist, PlaylistType } from '../models/Playlist';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { AppElectronService } from './electron.service';
import { EventType } from '../models/Events';
import { DataStoreService } from './data-store.service';
import { Video } from '../models/Video';
import { PagedVideos } from '../models/PagedVideos';

@Injectable()
export class PlaylistsService {

	public myPlaylists: BehaviorSubject<Playlist[]>;
	public customPlaylists: BehaviorSubject<Playlist[]>;
	public myName: ReplaySubject<string>;
	public lastPlaylistId: string;

	public videosMap: {[playlistid: string]: BehaviorSubject<PagedVideos> };

	constructor(
		private electronService: AppElectronService,
		private database: DataStoreService
		) {
		this.myPlaylists = new BehaviorSubject([]);
		this.customPlaylists = new BehaviorSubject([]);
		this.myName = new ReplaySubject(1);
		this.videosMap = {};

		this.electronService.listen(EventType.ACCOUNT_PLAYLISTS, this.addAccountPlaylists.bind(this));
		this.electronService.listen(EventType.GET_PLIST_VIDEOS_REPLY, this.updateVideosMap.bind(this));

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
		this.lastPlaylistId = id;
		return this.myPlaylists.value.find(p => p.id === id) ||
					 this.customPlaylists.value.find(p => p.id === id);
	}

	get lastPlaylist() {
		if (this.lastPlaylistId) {
			return this.myPlaylists.value.find(p => p.id === this.lastPlaylistId) ||
			this.customPlaylists.value.find(p => p.id === this.lastPlaylistId);
		}
	}

	getVideosForPlaylist(id: string) {
		const data: any = { playlistId: id };
		if (this.videosMap[id] && this.videosMap[id].value.nextPage) {
			data.nextPage = this.videosMap[id].value.nextPage
		}
		this.electronService.send(EventType.GET_PLIST_VIDEOS, data);
	}

	updateVideosMap(event, response) {
		if (response.status === 200) {
			const playlistId: string = response.config.params.playlistId;
			const current: PagedVideos = this.videosMap[playlistId].value;

			current.addVideos(response.data.items.map(item => new Video(item)));
			current.totalCount = response.data.pageInfo.totalResults;
			current.nextPage = response.data.nextPageToken;

			this.videosMap[playlistId].next(current);
		}
	}

	getPlaylistVideosSubject(id: string) {
		if (!this.videosMap[id]) {
			this.videosMap[id] = new BehaviorSubject<PagedVideos>(new PagedVideos());;
		}
		return this.videosMap[id];
	}
}