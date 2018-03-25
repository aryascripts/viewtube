import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';
import { GoogleApiService } from '../../providers/googleapi.service';

@Component({
	selector: 'app-search',
	templateUrl: 'search.component.html',
	styleUrls: ['search.component.scss']
})
export class SearchComponent implements OnInit {
	
	playlist:string
	channel:string
	nextPage:string
	current:{}

	constructor(
		private electronService: ElectronService,
		private googleApi: GoogleApiService) { }

	ngOnInit() {
		this.registerListeners();
	}

	registerListeners() {
		this.electronService.ipcRenderer.on('search-params-results', this.receivedResults);
	}

	handleSearch() {
		this.current = {playlist: this.playlist, channel: this.channel}
		this.searchEvent(this.current)
	}

	getNextPage() {
		this.searchEvent({...this.current, pageToken: this.nextPage})
	}

	private searchEvent(params) {
		this.electronService.ipcRenderer.send('search-params', params)
	}

	private receivedResults(event:any, response:any) {
		console.log(event, response);
	}
}