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

	playlist: string;
	channel: string;
	nextPage: string;
	loading: boolean;
	current: {};
	test: string;

	searchResults: Playlist[];

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
		this.electronService.listen('search-playlists-reply', this.receivedResults.bind(this));
	}

	handleSearch() {
		this.current = {playlist: this.playlist, channel: this.channel}
		this.searchEvent(this.current)
	}

	private searchEvent(params) {
		this.setLoading(true)
		console.log(params);
		this.electronService.send('search-playlists', params);
	}

	private receivedResults(event:any, response:any) {
		console.log(response);
		if(response.status !== 200) {
			alert('Something went wrong. Please see console');
			console.error(response);
		}
		const playlists = response.data.items; // array of objects
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
