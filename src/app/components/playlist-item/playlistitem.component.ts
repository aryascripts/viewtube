import { Component, OnInit, Input } from '@angular/core';
import { Playlist } from './../../models/Playlist';

@Component({
	selector:'app-playlist-item',
	templateUrl: './playlistitem.component.html',
	styleUrls: ['playlistitem.component.scss']
})
export class PlaylistItemComponent implements OnInit {

	@Input() plist:Playlist;

	constructor() { }
	ngOnInit() {

	}


}