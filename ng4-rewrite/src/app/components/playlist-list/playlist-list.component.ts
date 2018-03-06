import { Component, OnInit, Input} from '@angular/core';
import { Playlist } from './../../models/Playlist';

@Component({
	selector: 'app-playlist-list',
	templateUrl: './playlist-list.component.html',
	styleUrls: ['./playlist-list.component.scss']
})
export class PlaylistListComponent implements OnInit {

	closed:Boolean;
	caretClass:{};
	listClass:{};
	@Input() playlists: Playlist[];

	constructor() { }
	ngOnInit() {
		this.closed = true;
		this.setClasses();
	}

	toggleDropdown() {
		this.closed = !this.closed;
		this.setClasses();
	}

	setClasses() {
		this.caretClass = {
			'open': !this.closed
		}
		this.listClass = {
			'hide': !this.closed
		}
	}
}