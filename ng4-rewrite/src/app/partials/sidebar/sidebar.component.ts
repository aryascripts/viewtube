import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';
import { Playlist } from '../../models/Playlist';
import { GoogleApiService } from '../../providers/googleapi.service';
import PlaylistsService from '../../providers/playlist.service';

@Component({
	selector: 'app-sidebar',
	templateUrl: 'sidebar.component.html',
	styleUrls: ['sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
	sidebarHeader: string = 'Sign In With Google';
	
	playlists:Playlist[];

	constructor(private googleApiService: GoogleApiService,
							private playlistsService: PlaylistsService) {
								this.registerEvents();

							}

	ngOnInit() {
		
	}

	registerEvents() {
		this.playlistsService.getMyPlaylists()
			.subscribe(value => this.playlists = value);
	}

	loginHandler() {
		this.googleApiService.login();
	}
}