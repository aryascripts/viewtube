import { Injectable, Inject} from '@angular/core';
import { Playlist, PlaylistType } from '../models/Playlist';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { AppElectronService } from './electron.service';
import { EventType } from '../models/Events';
import { DataStoreService } from './data-store.service';
import { Video } from '../models/Video';
import { PagedVideos } from '../models/PagedVideos';
import { VideoMetadata } from '../models/VideoMetadata';
import { PlaylistOrder } from '../models/AppConfig';
import { AppConfigService } from './app-config.service';

@Injectable()
export class PlaylistsService {

	public myPlaylists: BehaviorSubject<Playlist[]>;
	public customPlaylists: BehaviorSubject<Playlist[]>;
	public myName: ReplaySubject<string>;
	public lastPlaylistId: string;

	public videosMap: {[playlistid: string]: BehaviorSubject<PagedVideos> };

	public watchedVideos: {[id: string]: VideoMetadata} = {};

	constructor(
		private electronService: AppElectronService,
		private database: DataStoreService,
		private appConfig: AppConfigService
		) {
		this.myPlaylists = new BehaviorSubject([]);
		this.customPlaylists = new BehaviorSubject([]);
		this.myName = new ReplaySubject(1);
		this.videosMap = {};

		this.electronService.listen(EventType.ACCOUNT_PLAYLISTS, this.addAccountPlaylists.bind(this));
		this.electronService.listen(EventType.GET_PLIST_VIDEOS_REPLY, this.updateVideosMap.bind(this));

		this.loadFromDatabase();
	}

	addAccountPlaylists(event: any, resp: any) {
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
		const sub = this.appConfig.config.subscribe(value => {
			if (!this.customPlaylists.value.some(p => playlist.id === p.id)) {
				playlist.order = value.defaultType;
				this.database.savePlaylist(playlist, PlaylistType.CUSTOM);
				this.customPlaylists.next([...this.customPlaylists.value, playlist]);
				console.log(playlist);
			}
			sub.unsubscribe();
		});
	}

	async loadFromDatabase() {
		const playlists = (await this.database.getCustomPlaylists())
												.map(item => new Playlist(item));
		this.customPlaylists.next(playlists);
	}

	async loadWatchedVideosFromDb(playlistId: string) {
		const documents: any[] = await this.database.getWatchedVideosForPlaylist(playlistId);
		console.log(documents);
		const newDocuments = {};
		documents.forEach(doc => {
			newDocuments[doc.videoId] = doc
		});
		this.watchedVideos = {
			...this.watchedVideos,
			...newDocuments
		}
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
		console.log(this.videosMap[id].value);
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

	async updateVideoTime(id: string, time: number) {
		 this.watchedVideos[id] = this.watchedVideos[id] ? this.watchedVideos[id] : {
			 videoId: id,
			 playlistId: this.getPlaylistIdFromVideoId(id)
		 };
		 this.watchedVideos[id].seconds = Math.floor(time) - 10;
		 return this.database.saveWatchedVideo(this.watchedVideos[id]);
	}

	getPlaylistIdFromVideoId(videoId: string) {
		let playlistId;
		Object.keys(this.videosMap)
			.forEach(playlist => {
				const current = this.videosMap[playlist].value;
				console.log(current);
				if (current.videos.some(v => v.id === videoId)) {
					playlistId = playlist;
				}
			});
		return playlistId;
	}
}