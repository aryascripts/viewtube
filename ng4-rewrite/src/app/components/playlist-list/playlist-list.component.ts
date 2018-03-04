import { Component, OnInit, Input} from '@angular/core';
import { Playlist } from './../../models/Playlist';

@Component({
	selector: 'app-playlist-list',
	templateUrl: './playlist-list.component.html',
	styleUrls: ['./playlist-list.component.scss']
})
export class PlaylistListComponent implements OnInit {

	@Input() playlists: Playlist[];

	constructor() { }
	ngOnInit() {

	}

}