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
	
	clearWatchedWatching = () => {
		this.watching = false;
		this.watched = false;
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
		this.thumbnails = vid['thumbnails'];

		this.percentage = 0;
		this.watched = false;

		this.watching = false;
		this.watchingTime = 0;
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