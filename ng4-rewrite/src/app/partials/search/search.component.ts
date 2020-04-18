import { Component, OnInit, NgZone } from '@angular/core';
import { AppElectronService } from '../../providers/electron.service';
import { GoogleApiService } from '../../providers/googleapi.service';
import { Playlist } from '../../models/Playlist';

@Component({
	selector: 'app-search',
	templateUrl: 'search.component.html',
	styleUrls: ['search.component.scss']
})
export class SearchComponent implements OnInit {

	playlist:string
	channel:string
	nextPage:string
	loading:boolean
	current:{}

	searchResults: Playlist[]

	resp:string = `{
		"etag": "RmznBCICv9YtgWaaa_nWDIH1_GM/xS7cgm5cCfSBf857_A4fQlhXtk4",
		"id": {
			"kind": "youtube#playlist",
			"playlistId": "PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH"
		},
		"kind": "youtube#searchResult",
		"snippet": {
			"channelId": "UCvjgXvBlbQiydffZU7m1_aw",
			"channelTitle": "The Coding Train",
			"description": "Watch me take on some viewer submitted Coding Challenges in p5.js and Processing!",
			"liveBroadcastContent": "none",
			"publishedAt": "2016-04-13T03:10:47.000Z",
			"thumbnails": {
				"default": {
					"height": 90,
					"url": "https://i.ytimg.com/vi/17WoOqgXsRM/default.jpg",
					"width": 120
				},
				"high": {
					"height": 360,
					"url": "https://i.ytimg.com/vi/17WoOqgXsRM/hqdefault.jpg",
					"width": 480
				},
				"medium": {
					"height": 180,
					"url": "https://i.ytimg.com/vi/17WoOqgXsRM/mqdefault.jpg",
					"width": 320
				}
			},
			"title": "Coding Challenges"
		}
	}`;



	plist: Playlist = new Playlist(JSON.parse(this.resp));

	constructor(
		private electronService: AppElectronService,
		private googleApi: GoogleApiService,
		private zone: NgZone) {
			this.searchResults = []
		}

	ngOnInit() {
		this.registerListeners()


	}

	registerListeners() {
		// this.electronService.ipcRenderer.on('search-params-results', this.receivedResults.bind(this));
	}

	handleSearch() {
		this.current = {playlist: this.playlist, channel: this.channel}
		this.searchEvent(this.current)
	}

	getNextPage() {
		this.searchEvent({...this.current, pageToken: this.nextPage})
	}

	private searchEvent(params) {
		// this.electronService.ipcRenderer.send('search-params', params)
		this.setLoading(true)
	}

	private receivedResults(event:any, response:any) {
		if(response.status !== 200) {
			alert('Something went wrong. Please see console');
			console.error(response);
		}
		const playlists = response.res.data.items; // array of objects
		this.searchResults = playlists.map(info => Playlist.fromSearchResults(info));
		console.log(this.searchResults);

		this.setLoading(false)
	}

	private setLoading(val: boolean) {
		this.zone.run(() => {
			this.loading = val
		})
	}

	private createPlaylist(s: string) {
		return new Playlist(JSON.parse(s));
	}
}
