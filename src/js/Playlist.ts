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

	getVideos = () => this.videos;
	getId = () => this.id;
	getChannel = () => this.channelName;
	getDescription = () => this.description;
	getLastVideoNumber = () => this.lastVideo;
	getThumbnailUrl = () => this.thumbnails['default']['url'];
	getTitle = () => this.title;
	getTotalVideos = () => this.totalVideos;

	constructor(info:object) {
		if(info['length'] < 1) {
			return;
		}
		this.lastVideo = 0;
		this.videos 		= [];
		this.obj 			= info;

		let plist 			= info[0]['snippet'];
		this.id 			= info['0']['id'];
		this.title 			= plist['title'];
		this.channelName 	= plist['channelTitle'];
		this.description 	= plist['description'];
		this.thumbnails 	= plist['thumbnails'];
	}

	public addVideos(list:Array<object>) {
		for(let i = 0; i < list.length; i++) {
			this.videos.push(new Video(list[i]));
		}
		this.totalVideos = list.length;
	}

	




}