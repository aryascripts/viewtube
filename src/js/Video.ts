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
	percentage:number;
	watched:boolean;
	watching:boolean;
	index:number;

	watchingTime:number;

	setPercentage = (time) =>  {
		this.percentage = Math.floor((time / this.durationSec)*100);
		this.watchingTime = Math.floor(time);
	}

	setWatched = (val) => {
		this.watched = val;
		if(val) {
			this.watching = !val;
		}	
	}

	setWatching = (val) => {
		this.watching = val;
		this.watched = !val; 
	}

	clearWatchedWatching = () => {
		this.watching = false;
		this.watched = false;
	}

	constructor(video:any, wahtchedList:any) {
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

		this.percentage = 0;
		this.watched = false;

		this.watching = false;
		this.watchingTime = 0;
	}

	public setData(data, watchedList, watchingList) {
		let dur = this.convertTime(data['items'][0]['contentDetails']['duration']);
		this.durationSec = dur.seconds;
		this.duration = dur.string;

		if(watchedList.includes(this.id)) {
			this.watched = true;
		}

		//A video cannot be made both 'watched' and 'watching'
		else {
			for(let i = 0; i < watchingList.length; i++) {
				if(watchingList[i].id === this.id) {
					this.watching = true;
					this.watchingTime = watchingList[i].time
					this.percentage = Math.floor(watchingList[i].time / this.durationSec * 100);
					break;
				}
			}
		}
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
}