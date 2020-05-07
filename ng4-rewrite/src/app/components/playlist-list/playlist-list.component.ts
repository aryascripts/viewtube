import { Component, OnInit, Input, Output} from '@angular/core';
import { Playlist } from './../../models/Playlist';
import { EventEmitter } from '@angular/core';

@Component({
	selector: 'app-playlist-list',
	templateUrl: './playlist-list.component.html',
	styleUrls: ['./playlist-list.component.scss']
})
export class PlaylistListComponent implements OnInit {

	listClass: any;
	@Input() playlists: Playlist[];
	@Input() title: string;
	@Input() additive: boolean;
	@Input() open: boolean;
	@Input() loading: boolean;

	@Output() openChanged: EventEmitter<boolean> = new EventEmitter();

	constructor() { }
	ngOnInit() {
		this.setClasses();
	}

	toggleDropdown() {
		this.open = !this.open
		this.openChanged.emit(this.open);
		this.setClasses();
	}

	setClasses() {
		this.listClass = {
			'hide': !this.open
		}
	}

	handleAddPlaylist() {
		
	}
}