import { Component } from '@angular/core';
import { SharedService } from './../../providers/shared.service/shared.service';
import { ActivatedRoute } from '@angular/router';
import { Playlist } from './../../objects/Playlist';
import { api_key } from './../../objects/api_key';
import { DomSanitizer  } from '@angular/platform-browser';
import { ElectronService } from './../../providers/electron.service';

@Component({
	selector: 'playlist',
	templateUrl: './playlist.component.html',
	styleUrls: ['./../../../assets/css/style.css']
})

export class PlaylistComponent {

	index:any;
	playlists:Playlist[]
	max:number;
	config:any;

	playlist:Playlist;

	constructor(private sanitizer:DomSanitizer,
				private shared:SharedService, 
				private route:ActivatedRoute,
				private electronService:ElectronService) {
		this.index = this.route.snapshot.paramMap.get('id');
		this.playlists = this.shared.getPlaylists();
		this.playlist = this.shared.getPlaylists()[this.index];

		this.max = 50;
		this.config = this.shared.getConfig();

		this.electronService.ipcRenderer.on('load-next', (event, data) => {
			this.loadNextEvent(data);
		});

		this.electronService.ipcRenderer.on('calc-watch-time', (event, data) => {
			this.calculateWatchTime(data.time, data.id);
		});
	}

	ngAfterViewInit() {
		this.populate();
	}

	savePlaylist() {
		this.shared.setPlaylist(this.playlist, this.index);
	}

	loadVideo(val:number) {
		console.log('loading video ', val);

		this.playlist.watching = val;
		console.log('setting watching to ' + val);
		this.playlist.videos[val].setWatching(true);
		this.playlist.watchingId = this.playlist.videos[val].id;

		this.savePlaylist();

		//Check if config wants to restart the video
		let time = this.shared.getConfig().restart ? 0 : this.playlist.videos[val].watchingTime;

		this.electronService.ipcRenderer.send(
			'create-window', 
			{
				'id': this.playlist.videos[val].id,
				'time': time
			}
		);
	}

	loadNextEvent(data:any) {
		console.log('loading next video', data);
		let watching = this.playlist.watching;
		let watchingId = this.playlist.videos[watching].id;

		//If the current watching video's ID does not match
		//The one that was passed in, then ignore the event.
		if(watchingId !== data.from) {
			console.log('ignoring event');
			return;
		}

		console.log(this.playlist.type);

		//mark the CURRENT video as watched & push the ID
		this.playlist.videos[watching].setWatched(true);
		this.pushToWatched(watchingId);

		//if playlist is sequential
		if(this.playlist.type == 'sequential') {
			console.log('sequential next load')
			//loadNext takes the parameter from where to load the next video
			//in this case, this would be the CURRENT, and it loads the NEXT.
			this.loadNext(watching);
		}

		//non-sequential playlist
		else {
			console.log('non-sequential next load');
			this.loadNonSequential(watching);
		}
	}

	//Loads the next video from given index.
	//If there is no next window, video window
	//is asked to be closed.
	loadNext(from: number) {

		console.log('loading from ' + from);
		//check if trying to load next from the LAST video in the playlist
		if(from === this.playlist.totalVideos - 1) {
			//there are no more videos in this playlist 
			this.electronService.ipcRenderer.send('close-video');
		}

		//there is a next video, load it
		//check if you want to skip watched videos
		else {
			let n = from+1;
			if(this.playlist.sequential && this.shared.getConfig().skipWatched) {
				for(let i = n; i < this.playlist.totalVideos; i++) {
					if(!this.playlist.videos[i].watched) {
						n = i;
						break;
					}
				}
			}

			this.loadVideo(n);
		}
	}

	loadNonSequential(from:number) {
		//check if this video is really non sequential
		if(this.playlist.type == 'sequential') { 
			if(confirm('Something went wrong. Error#: 151. It is recommended you restart ViewTube. Press OK to view or create an issue in GitHub.')) {

			}
		}

		switch(this.shared.getConfig().afterNonsequentialFinishesSelected.id) {
			case 'next':
				this.loadNext(from);
				break;
			
			case 'close':
				this.electronService.ipcRenderer.send('close-video');
				break;

			default:
				this.loadRandomVideo();
				break;
		}
	}

	loadFromIndex(index:number) {
		//If config allows, restart the clicked video.
		//If not, load the time left at (if not started, this was initialized to 0)

		//set the current video unwatched (because the user clicked on it to watch it)
		this.playlist.videos[index].setWatched(false);
		
		//remove the id from the array 'watched' if it exists
		for(let i = 0; i < this.playlist.watched.length; i++) {
			if(this.playlist.watched[i] === this.playlist.videos[index].id) {
				this.playlist.watched.splice(i,1);
			}
		}

		//mark all previous watched if the setting allows it.
		if(this.playlist.type == 'sequential' && this.shared.getConfig().markPrevious) {
			console.log('marking previous watched');
			this.markPreviousWatched(index);
		}

		//mark all next unwatched if the setting allows it
		//dont do it if this is the last video in the playlist.
		if(this.playlist.type === 'sequential' && this.shared.getConfig().markNext && index < this.playlist.totalVideos-1) {
			console.log('marking next unwatched');
			this.markNextUnwatched(index);
		}

		this.loadVideo(index);
	}

	pushToWatched(id:string) {
		console.log('pushing to watched ', id);

		if(!this.playlist.watched.includes(id)) {
			this.playlist.watched.push(id);
		}
	}

	pushToPartiallyWatched(index:number, time:number) {
		console.log('pushing to partially watched', index, time);
		this.playlist.watchingTime = time;
		this.playlist.videos[index].setPercentage(time);
		this.playlist.videos[index].setWatching(true);
		let found = false;

		for(let i = 0; i < this.playlist.partial.length; i++) {
			//Check if this video already exists as a partially watching
			if(this.playlist.videos[index].id === this.playlist.partial[i].id) {
				this.playlist.partial[i].time = Math.floor(time);
				found = true;
				break;
			}
		}

		//If the video was not found in 'partial', then push it.
		if(!found) {
			this.playlist.partial.push({
				'id': this.playlist.videos[index].id,
				'time': Math.floor(time)
			});
		}
	}

	loadRandomVideo() {
		//all videos were watched, just load any video.
		if(this.playlist.watched.length === this.playlist.totalVideos) {
			this.loadVideo(Math.floor(Math.random() * (this.playlist.videos.length-1)));
		}

		//else, look for a video that is unwatched
		else {
			let found = false;
			while(!found) {
				let rand = Math.floor(Math.random() * (this.playlist.videos.length-1));
				if(!this.playlist.videos[rand].watched) {
					found = true;
					this.loadVideo(rand);
				}
			}
		}
	}

	//If the video has been watched more than the threshhold in Settings,
	//Set it as watched, and save it to database.
	calculateWatchTime(timeCompleted:number, vidId:string) {
		console.log('CALCULATE ENOUGH WATCHED TIME');

		if(this.playlist.watching < 0) return;
		if(this.playlist.videos[ this.playlist.watching ].id !== vidId) {
			return;
		}
		
		let thresh = this.shared.getConfig().threshhold;
		console.log('watching#:'+this.playlist.watching)
		let totalTime = this.playlist.videos[ this.playlist.watching ].durationSec;
		let perc =  timeCompleted / totalTime;
		console.log(thresh + ' ' + perc);

		//enough of the video was watched
		if(perc > thresh) {
			
			let finished = this.playlist.watching;
			console.log('video was marked as watched: ' + finished );

			this.playlist.videos[finished].setWatched(true);
			this.pushToWatched(this.playlist.videos[finished].id);
			this.playlist.lastCompleted = finished;
			
			//reset the partially watched ID since there is none anymore.
			console.log('SETTING WATCHING TO -1');
			this.playlist.watching = -1;
			console.log('setting watching to -1');
			this.playlist.watchingTime = -1;
			this.playlist.watchingId = '';

			console.log(this.playlist.videos[finished].title + ' was set as watched');
		}

		//video was only partially watched
		else {
			console.log('video was marked partially watched');
			this.pushToPartiallyWatched(this.playlist.watching, timeCompleted);
		}

		this.savePlaylist();
	}


	getStyle(i:number) {
		let percentage:number = this.playlist.videos[i].watched ? 100 : this.playlist.videos[i].percentage;
		return this.sanitizer.bypassSecurityTrustStyle('-webkit-linear-gradient(left, #6b6969 0%,#6b6969 '+percentage+'%,#d82020 '+percentage+'%,#d82020 100%)');

	}

	// takes an index and marks all the previous videos 
	// (excluding n) as watched. 
	// mainly used for sequential playlists 
	markPreviousWatched(n) {
		if(n === 0) return;
		for(let i = 0; i < n; i++) {
			this.playlist.videos[i].setWatched(true);
			this.pushToWatched(this.playlist.videos[i].id);
		}
		this.playlist.lastCompleted = n-1;
		this.savePlaylist();
	}

	//marks the next videos in playlist
	//as unwatched (leaves the current n alone)
	markNextUnwatched(n) {
		for(let i = n+1; i < this.playlist.totalVideos; i++) {
			this.playlist.videos[i].setWatched(false);
			for(let j = 0; j < this.playlist.watched.length; j++) {
				if(this.playlist.videos[i].id === this.playlist.watched[j]) {
					this.playlist.watched.splice(j,1);
				}
			}
		}
		this.savePlaylist();
	}


	//*****************************************************************//
	//	     ALL OF THESE ARE MEANT TO POPULATE CURRENT PLAYLIST      //
	populate() {
		if(this.playlist.videos.length < this.playlist.totalVideos) {
			
			this.playlist.videos = [];
			this.getVideos(this.playlist.id, null)
					.then(videos => {
						//add these videos
						this.playlist.addVideos(videos);
						
						//if there's a next page
						let nextPageToken = (videos['nextPageToken'] !== undefined) ? videos['nextPageToken'] : null;
						if(nextPageToken) {
							console.log('getting next page...')
							this.nextPage(nextPageToken)
								.then(() => {});
						} 

						//there is no other pages
						else {
							console.log('getting more info for the 50.');
							this.getMoreInfo();
						}
				}); //then
		} //if
	} //fn

	//Goes to the Google server (with HttpRequest) and retreives the videos inside a playlist id
	//Gets 50 videos (max) at a time and returns the data
	getVideos(id:string, page:string) {
		let location = 'https://www.googleapis.com/youtube/v3/playlistItems';
		let headers = {
			'playlistId': id,
			'part':'snippet,contentDetails',
			'key': api_key,
			'maxResults': this.max
		};

		//if a page was passed in, add that to the header object.
		if(page !== null) {
			headers['pageToken'] = page;
		}
		
		//this returns a promise
		return this.shared.getRequest().getResponse(location, headers)
			.then(data => {
				console.log(data);
				return data;
			})
			.catch(error => {
				console.log(error);
			});
	}

	//called with the ID of the PLAYLIST (this playlist)
	//This method loops until there are no more pages left.
	nextPage(page) {
		return this.getVideos(this.playlist.id, page)
			.then(moreVideos => {
				this.playlist.addVideos(moreVideos);
				
				if(moreVideos['nextPageToken'] !== undefined) {
					this.nextPage(moreVideos['nextPageToken']);
				}
				else {
					console.log('getting more info from the next page')
					console.log(this.playlist.videos.length);
					this.getMoreInfo();
				}
			});
	}

	//Gets video-specific information for
	//all videos in the playlist currently
	//ONLY called when the playlist.videos length == playlists.totalVideos
	getMoreInfo() {
		let info = [];
		let url = 'https://www.googleapis.com/youtube/v3/videos';

		for(let i = 0; i < this.playlist.videos.length ; i++) {
			let headers = {
				'id': this.playlist.videos[i].id,
				'key':api_key,
				'part':'contentDetails,snippet'
			};

			//set the index of the video in Video object (mainly for search)
			this.playlist.videos[i].index = i;

			//set the playlists[this.index].watching index (NUMBER)
			if(this.playlist.videos[i].id === this.playlist.watchingId) {
				this.playlist.watching = i;
				console.log('setting watching to ' + i);
			}

			this.shared.getRequest().getResponse(url, headers)
			.then(data => {
				this.playlist.videos[i].setData(data, this.playlist.watched, this.playlist.partial);

				this.playlist.playlistDuration();
			}); //shared.request()	
		} //for
		this.savePlaylist();
	} //fn
	 //				POPULATE ENDS 				//
	//*****************************************//


}