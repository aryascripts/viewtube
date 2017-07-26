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
	watched: Array<string>;		//array of video IDs which is then used to set videos as watched upon loadVideos();
	partial: Array<string>;

	lastCompleted:number;
	lastCompletedId:string;

	getThumbnailUrl = () => this.thumbnails['default'].url;

	constructor(info:any) {
		if(info['length'] < 1) {
			return;
		}
		this.videos 		= [];
		this.obj 			= info;
		this.totalVideos 	= info['items'][0]['contentDetails']['itemCount'];

		let plist 			= info['items'][0]['snippet'];
		this.id 			= info['items']['0']['id'];
		this.title 			= plist['title'];
		this.channelName 	= plist['channelTitle'];
		this.description 	= plist['description'] || this.channelName + ' has not set a description for this playlist. Go bug them about it, not me!';
		this.thumbnails 	= plist['thumbnails'];

		this.sequential = true;
		this.watched = [];
		this.partial = [];
		this.watching = -1;
		this.lastCompleted = -1;
		this.lastCompletedId = '';
		this.index = 0;

		this.watchingId = '';
	}

//// REMINDER: This is only adding 5 videos! Pagination or re-query is needed.
	public addVideos(videos:any) {
		let list = videos['items'];
		for(let i = 0; i < list.length; i++) {
			this.videos.push(new Video(list[i], false));
		}
	}

}