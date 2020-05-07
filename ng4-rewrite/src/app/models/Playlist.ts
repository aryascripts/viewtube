import { Video } from './Video';
import { DatabaseObject } from './DatabaseObject';
import { PlaylistSettings, defaultPlaylistSettings } from './AppConfig';

export class Playlist extends DatabaseObject {

	documentType: string;
	title:string;
	id:string;	
	videos: Array<Video>;
	obj:any;
	channelName:string;
	thumbnails:object;
	description:string;

	settings: PlaylistSettings;

	lastWatchedVideoId: string;

	getThumbnailUrl = () => this.thumbnails['default'].url;

	constructor(info) {
		super();
		this.id = info.id
		this.title = info.title
		this.channelName = info.channelName
		this.description = info.description || `${this.channelName} has not set a description for this playlist. Go bug them about it, not me!`
		this.thumbnails = info.thumbnails
		this.settings = {...defaultPlaylistSettings, ...info.settings};
	}
	
	static fromPlaylistsList(info: any) {
		if(info['length'] < 1) {
			return null;
		}
		
		let plist = info['snippet']

		return new this({
			totalVideos: info['contentDetails']['itemCount'],
			id: info['id'],
			title: plist['title'],
			channelName: plist['channelTitle'],
			description: plist['description'],
			thumbnails: plist['thumbnails']
		})
	}

	static fromSearchResults(info: any) {
		
		let plist = info['snippet']

		return new this({
			totalVideos: null,
			id: info['id']['playlistId'],
			title: plist['title'],
			channelName: plist['channelTitle'],
			description: plist['description'],
			thumbnails: plist['thumbnails']
		})
	}
}