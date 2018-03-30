import { Video } from './Video';
export class Playlist {

	title:string;
	id:string;	
	videos: Array<Video>;
	obj:any;
	channelName:string;
	thumbnails:object;
	description:string;
	
	totalVideos:number;

	watching:number;			//used only when there is an unwatched last video
	watchingId:string;
	watchingTime:number;

	index:number;


	sequential:boolean;
	type:string;
	watched: Array<string>;		//array of video IDs which is then used to set videos as watched upon loadVideos();
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
		this.totalVideos = info.totalVideos
		this.id = info.id
		this.title = info.title
		this.channelName = info.channelName
		this.description = info.description
		this.thumbnails = info.thumbnails

		this.setDefaults()
	}
	
	static fromPlaylistsList(info: any) {
		console.log(info);
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
		console.log(info)
	}

	setDefaults() {
		this.type = 'sequential';
		this.watched = [];
		this.partial = [];
		this.watching = -1;
		this.lastCompleted = -1;
		this.lastCompletedId = '';
		this.index = 0;
		this.totalTime = '';
		this.watchingId = '';
	}

	// constructor(info) {
	// 	this.title = info.title;
	// 	this.channelName = info.channelName;
	// 	this.description = info.description;
	//  }
	
    //// REMINDER: This is only adding 5 videos! Pagination or re-query is needed.
	// public addVideos(videos:any) {
	// 	let list = videos['items'];
	// 	for(let i = 0; i < list.length; i++) {
	// 		this.videos.push(new Video(list[i], false));
	// 	}
	// }

	// public playlistDuration() {
	// 	return new Promise(
	// 		(resolve, reject) => {
	// 			let secs = 0;
	// 			for(let i = 0; i < this.videos.length; i++) {
	// 				secs += this.videos[i].durationSec;
	// 			}

	// 			let h = Math.floor(secs / 3600);
	// 			let m = Math.floor(secs % 3600 / 60);
	// 			let s = Math.floor(secs % 3600 % 60);

	// 			this.totalTime = ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
	// 			resolve();
	// 		});
	// }

	public setType(ty:string) {
		this.type = ty;
	}
}