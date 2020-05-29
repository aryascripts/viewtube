import { Component, OnInit, NgZone } from '@angular/core';
import { AppElectronService } from '../../providers/electron.service';
import { GoogleApiService } from '../../providers/googleapi.service';
import { Playlist } from '../../models/Playlist';
import { EventType } from './../../models/Events';

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
		this.electronService.listen(EventType.SEARCH_REPLY, this.receivedResults.bind(this));
	}

	handleSearch() {
		this.current = {playlist: this.playlist, channel: this.channel}
		this.searchEvent(this.current)
	}

	handleInputChange(event) {
		console.log(event);
	}

	private searchEvent(params) {
		this.setLoading(true)
		this.electronService.send('search-playlists', params);
	}

	private receivedResults(event:any, response:any) {
		if(response.status !== 200) {
			alert('Something went wrong. Please see console');
			console.error(response);
		}
		console.log(response);
		const playlists = response.data.items; // array of objects
		this.searchResults = playlists.map(info => Playlist.fromSearchResults(info));
		this.setLoading(false)
	}

	private setLoading(val: boolean) {
		this.zone.run(() => {
			this.loading = val
		})
	}
}
