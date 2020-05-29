import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from './../../providers/user.service';
import { PlaylistsService } from './../../providers/playlist.service';
import { Subscription } from 'rxjs';
import { Playlist } from './../../models/Playlist';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	subscription: Subscription[];

	constructor(
		public userService: UserService,
		public playlistService: PlaylistsService
	) {}

	ngOnInit(): void {}
	
	userName() {
		return this.userService.name.value + '!' || 'please login.';
	}

	getPlaylist() {
		return this.playlistService.lastPlaylist;
	}

}