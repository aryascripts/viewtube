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

	private playNextVideoFor: string;

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
		this.electronService.listen(EventType.PLAY_NEXT, this.playNextVideo.bind(this));
		this.electronService.listen(EventType.UPDATE_TIME, this.updateVideoTime.bind(this));

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

  playVideo(video: Video) {
    const lastPlayTime = this.watchedVideos[video.id] 
    ? this.watchedVideos[video.id].seconds : 0;
    this.electronService.send(EventType.PLAY_VIDEO, {
      videoId:  video.id,
      time: lastPlayTime
    });
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

			const newVideos = response.data.items.map(item => new Video(item));
			current.addVideos(newVideos);
			current.totalCount = response.data.pageInfo.totalResults;
			current.nextPage = response.data.nextPageToken;

			if (this.playNextVideoFor === playlistId) {
				this.playVideo(newVideos[0]);
				this.playNextVideoFor = undefined;
			}
			this.videosMap[playlistId].next(current);
		}
	}

	/**
	 * Creates new BehaviorSubject if needed
	 * @param id 
	 */
	getPlaylistVideosSubject(id: string): BehaviorSubject<PagedVideos> {
		if (!this.videosMap[id]) {
			this.videosMap[id] = new BehaviorSubject<PagedVideos>(new PagedVideos());;
		}
		return this.videosMap[id];
	}

	/**
	 * This sets the video watch time and pushes to database
	 * This is also responsible for marking video watched
	 * @param id 
	 * @param time 
	 */
	async updateVideoTime(event, data) {
		const id = data.videoId;
		const time = data.time;
		const duration = data.duration;
		const config = this.appConfig.config.value;
		this.watchedVideos[id] = this.watchedVideos[id] ? this.watchedVideos[id] : {
			videoId: id,
			playlistId: this.getPlaylistIdFromVideoId(id),
			totalSeconds: duration,
			watched: false
		};

		const video = this.watchedVideos[id];
		video.seconds = Math.floor(time) - 10;
		video.seconds = video.seconds > 0 ? video.seconds : 0;
		if (video.seconds / video.totalSeconds > config.watchedAfter) {
			video.watched = true;
		}
		this.watchedVideos[id] = video;
		console.log(data, this.watchedVideos, video, config);
		return this.database.saveWatchedVideo(video);
	}

	/**
	 * Helper function to get playlist ID from video id.
	 * @param videoId
	 */
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

	/**
	 * 
	 * @param videoId Helper function to get Video object from video id
	 */
	getVideoDataFromId(videoId: string): Video {
		let video;
		Object.keys(this.videosMap)
			.forEach(playlist => {
				const current: PagedVideos = this.videosMap[playlist].value;
				const vid = current.videos.find(v => v.id === videoId);
				if (vid) video = vid;
			});
		return video;
	}

	playNextVideo(event, data) {
		const id = data.videoId;
		this.watchedVideos[id] = {
			...this.watchedVideos[id],
			watched: true,
			totalSeconds: data.duration,
			seconds: data.duration
		};
		if (this.watchedVideos[id].playlistId) 
			this.watchedVideos[id].playlistId = this.getPlaylistIdFromVideoId(id);

		const videoPages = this.videosMap[this.watchedVideos[id].playlistId].value;
		const index = videoPages.videos.findIndex(v => v.id === id);
		// TODO - load more pages if this is the last one in the page
		if (index >= videoPages.videos.length - 1) {
			this.playNextVideoFor = this.watchedVideos[id].playlistId;
			this.getVideosForPlaylist(this.watchedVideos[id].playlistId)
		}
		// Load next video in the list
		else {
			this.playVideo(videoPages.videos[index + 1]);
		}

		this.database.saveWatchedVideo(this.watchedVideos[id]);
	}

}