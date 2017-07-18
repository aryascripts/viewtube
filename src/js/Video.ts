import {api_key} from './APIAuth';
import { HttpRequest } from './helpers/HttpRequest';

export class Video {
	id:string;
	title:string;
	obj:any;
	channelName:string;
	thumbnails:object;
	description:string;
	date:string;
	duration:string;
	durationSec:number;

	getTitle 		= () => this.title;
	getChannel 		= () => this.channelName;
	getDescription 	= () => this.description;
	getDate 		= () => this.date;
	getId 			= () => this.id;
	getDuration 	= () => this.duration;
	getDurationSec 	= () => this.durationSec;

	setDuration		= (time) => this.duration = time;

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

	public setData(data) {
		let dur = this.convertTime(data['items'][0]['contentDetails']['duration']);
		this.durationSec = dur.seconds;
		this.duration = dur.string;
	}

	public convertTime(duration) {
	  var match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)

	  var hours = (parseInt(match[1]) || 0);
	  var minutes = (parseInt(match[2]) || 0);
	  var seconds = (parseInt(match[3]) || 0);

	  return {
	  	'seconds': hours * 3600 + minutes * 60 + seconds,
	  	'string': hours + ':' + minutes + ':' + seconds
	}
}