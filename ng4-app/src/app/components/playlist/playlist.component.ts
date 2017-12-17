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

	constructor(private sanitizer:DomSanitizer,
				private shared:SharedService, 
				private route:ActivatedRoute,
				private electronService:ElectronService) {
		this.index = this.route.snapshot.paramMap.get('id');
		this.playlists = this.shared.getPlaylists();
		this.max = 50;
		this.config = this.shared.getConfig();
	}

	ngAfterViewInit() {
		this.populate();
	}

	getStyle(i:number) {
		let percentage:number = this.playlists[this.index].videos[i].percentage;
		console.log(percentage);

		return this.sanitizer.bypassSecurityTrustStyle('-webkit-linear-gradient(left, #6b6969 0%,#6b6969 '+ 40 +'%,#d82020 '+ 40 +'%,#d82020 '+ 40 +'%,#d82020 100%)');
	}

	savePlaylist() {
		this.shared.setPlaylists(this.playlists);
	}

	loadVideo(val:number) {

			this.playlists[this.index].watching = val;
			console.log('setting watching to ' + val);
			this.playlists[this.index].videos[val].setWatching(true);
			this.playlists[this.index].watchingId = this.playlists[this.index].videos[val].id;

			this.savePlaylist();

			//Check if config wants to restart the video
			let time = this.shared.getConfig().restart ? 0 : this.playlists[this.index].videos[val].watchingTime;

			this.electronService.ipcRenderer.send(
				'create-window', 
				{
					'id': this.playlists[this.index].videos[val].id,
					'time': time
				}
			);
		}



	//************************************************//
	//	     ALL OF THESE ARE MEANT TO POPULATE      //
	populate() {
		if(this.playlists[this.index].videos.length < this.playlists[this.index].totalVideos) {
			
			this.playlists[this.index].videos = [];
			this.getVideos(this.playlists[this.index].id, null)
					.then(videos => {
						//add these videos
						this.playlists[this.index].addVideos(videos);
						
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
		return this.getVideos(this.playlists[this.index].id, page)
			.then(moreVideos => {
				this.playlists[this.index].addVideos(moreVideos);
				
				if(moreVideos['nextPageToken'] !== undefined) {
					this.nextPage(moreVideos['nextPageToken']);
				}
				else {
					console.log('getting more info from the next page')
					console.log(this.playlists[this.index].videos.length);
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

		for(let i = 0; i < this.playlists[this.index].videos.length ; i++) {
			let headers = {
				'id': this.playlists[this.index].videos[i].id,
				'key':api_key,
				'part':'contentDetails,snippet'
			};

			//set the index of the video in Video object (mainly for search)
			this.playlists[this.index].videos[i].index = i;

			//set the playlists[this.index].watching index (NUMBER)
			if(this.playlists[this.index].videos[i].id === this.playlists[this.index].watchingId) {
				this.playlists[this.index].watching = i;
				console.log('setting watching to ' + i);
			}

			this.shared.getRequest().getResponse(url, headers)
			.then(data => {
				this.playlists[this.index].videos[i].setData(data, this.playlists[this.index].watched, this.playlists[this.index].partial);

				this.playlists[this.index].playlistDuration();
			}); //shared.request()	
		} //for
		this.savePlaylist();
	} //fn
	 //				POPULATE ENDS 				//
	//*****************************************//


}