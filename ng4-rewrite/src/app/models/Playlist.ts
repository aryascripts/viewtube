import { Video } from './Video';
import { DatabaseObject } from './DatabaseObject';

export enum PlaylistType {
	CUSTOM = 'custom',
	ACCOUNT = 'account'
}

export class Playlist extends DatabaseObject {

	documentType: string;
	title:string;
	id:string;	
	videos: Array<Video>;
	obj:any;
	channelName:string;
	thumbnails:object;
	description:string;

	type: PlaylistType;
	
	totalVideos:number;

	watched: Array<string>;		//array of video IDs which is then used to set videos as watched upon loadVideos();
	watching:number;			//used only when there is an unwatched last video
	watchingId:string;
	watchingTime:number;

	index:number;

	sequential:boolean;
	partial: any;

	lastCompleted:number;
	lastCompletedId:string;

	totalTime:string;

	getThumbnailUrl = () => this.thumbnails['default'].url;

	constructor(info: {
		totalVideos: null,
		id: null,
		title: null,
		channelName: null,
		description: null,
		thumbnails: null,
	}) {
		super();
		this.totalVideos = info.totalVideos
		this.id = info.id
		this.title = info.title
		this.channelName = info.channelName
		this.description = info.description || `${this.channelName} has not set a description for this playlist. Go bug them about it, not me!`
		this.thumbnails = info.thumbnails

		this.setDefaults()
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

	setDefaults() {
		this.watched = [];
		this.partial = [];
		this.watching = -1;
		this.lastCompleted = -1;
		this.lastCompletedId = '';
		this.index = 0;
		this.totalTime = '';
		this.watchingId = '';
	}
}