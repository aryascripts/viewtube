import { Video } from './Video';
export class Playlist {

	id:string;
	title:string;
	videos: Array<Video>;
	obj:any;
	channelName:string;
	thumbnails:object;
	description:string;

	constructor(info:object) {
		if(info['length'] < 1) {
			return;
		}
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
	}

	public getDisplayHtml() {
		console.log('displaying ' + this.id);
	}


}