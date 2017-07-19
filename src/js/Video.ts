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
	isCurrent:boolean;
	percentage:number;

	getTitle 		= () => this.title;
	getChannel 		= () => this.channelName;
	getDescription 	= () => this.description;
	getDate 		= () => this.date;
	getId 			= () => this.id;
	getDuration 	= () => this.duration;
	getDurationSec 	= () => this.durationSec;

	setDuration		= (time) => this.duration = time;

	setPercentage 	= (decimal) =>  {
		this.percentage = Math.floor(decimal*100);
		this.isCurrent = true;
	}
	removeIsCurrent = () => {
		this.percentage = 0;
		this.isCurrent = false;
	}

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

		this.isCurrent = false;
		this.percentage = 0;
	}

	public setData(data) {
		let dur = this.convertTime(data['items'][0]['contentDetails']['duration']);
		this.durationSec = dur.seconds;
		this.duration = dur.string;
	}

	public convertTime(duration) {
	  var match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)

	  let h = (parseInt(match[1]) || 0);
	  let m = (parseInt(match[2]) || 0);
	  let s = (parseInt(match[3]) || 0);

	  let str = '';
	  if(h > 0) {
	  	str = `${(h < 10) ? 0 : ''}${h}:${(m < 10) ? 0 : ''}${m}:${(s < 10) ? 0 : ''}${s}`;
	  } else {
	  	str = `${(m < 10) ? 0 : ''}${m}:${(s < 10) ? 0 : ''}${s}`;
	  }

	  return {
	  	'seconds': h * 3600 + m * 60 + s,
	  	'string': str
	}
}