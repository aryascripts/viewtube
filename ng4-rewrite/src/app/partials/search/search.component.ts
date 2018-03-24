import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';
import { GoogleApiService } from '../../providers/googleapi.service';

@Component({
	selector: 'app-search',
	templateUrl: 'search.component.html',
	styleUrls: ['search.component.scss']
})
export class SearchComponent implements OnInit {

	constructor(
		private electronService: ElectronService,
		private googleApi: GoogleApiService) {


		}
	ngOnInit() {

	}
}