import { Video } from './Video';
export class Playlist {

	title:string;
	id:string;	
	videos: Array<Video>;
	obj:any;
	channelName:string;
	thumbnails:object;
	description:string;
	lastVideo:number;
	
	totalVideos:number;

	currentVideoWatchTime:number;
	currentVideo:number;

	getVideos = () => this.videos;
	getId = () => this.id;
	getChannel = () => this.channelName;
	getDescription = () => this.description;
	getLastVideoNumber = () => this.lastVideo;
	getThumbnailUrl = () => this.thumbnails['default']['url'];
	getTitle = () => this.title;
	getTotalVideos = () => this.totalVideos;

	setLastVideo = (index) => {
		this.lastVideo = index;
	}

	constructor(info:any) {
		if(info['length'] < 1) {
			return;
		}
		this.lastVideo 		= -1;
		this.videos 		= [];
		this.obj 			= info;
		this.totalVideos 	= info['items'][0]['contentDetails']['itemCount'];

		let plist 			= info['items'][0]['snippet'];
		this.id 			= info['items']['0']['id'];
		this.title 			= plist['title'];
		this.channelName 	= plist['channelTitle'];
		this.description 	= plist['description'] || this.channelName + ' has not set a description for this playlist. Go bug them about it, not me!';
		this.thumbnails 	= plist['thumbnails'];

		this.currentVideo = -1;
		this.currentVideoWatchTime = -1;
	}

//// REMINDER: This is only adding 5 videos! Pagination or re-query is needed.
	public addVideos(videos:any) {
		let list = videos['items'];
		for(let i = 0; i < list.length; i++) {
			this.videos.push(new Video(list[i]));
		}
	}

}