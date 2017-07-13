export class Video {
	id:string;
	title:string;
	obj:any;
	channelName:string;
	thumbnails:object;
	description:string;
	date:string;

	constructor(video:any) {
		if(video['length'] < 1) {
			return;
		}
		this.obj = video;

		let vid 			= video['snippet'];
		this.id 			= vid['resourceId']['videoId'];
		this.title 			= vid['title'];
		this.channelName 	= vid['channelTitle'];
		this.date 			= vid['publishedAt'];
		this.description 	= vid['description'];
	}
}