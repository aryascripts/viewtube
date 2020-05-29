import { Component, OnInit, NgZone } from '@angular/core';
import { AppElectronService } from '../../providers/electron.service';
import { Playlist } from '../../models/Playlist';
import { GoogleApiService } from '../../providers/googleapi.service';
import { PlaylistsService } from '../../providers/playlist.service';
import { UserService } from '../../providers/user.service';
import {EventType} from './../../models/Events';

@Component({
	selector: 'app-sidebar',
	templateUrl: 'sidebar.component.html',
	styleUrls: ['sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
	sidebarHeader: string = 'Sign In With Google';
	playlists:Playlist[];
	loading: { account: boolean, custom: boolean };
	customPlaylists: Playlist[];

	constructor(private googleApiService: GoogleApiService,
							private playlistsService: PlaylistsService,
							private zone:NgZone,
							private userService: UserService,
							private electronService: AppElectronService) {
		this.loading = { account: false, custom: false }
	}

	ngOnInit() {
		this.registerEvents()
	}

	registerEvents() {
		this.playlistsService.myPlaylists.subscribe(value => {
					this.loading.account = false;
					this.playlists = value;
			});

		this.userService.name.subscribe(value => {
			this.sidebarHeader = value;
		});

		this.playlistsService.customPlaylists.subscribe(value => {
			console.log('value', value);
			this.customPlaylists = value;
		})
	}

	loginHandler() {
		this.googleApiService.login()
	}

	handleOpenChanged(open: boolean) {
		if (open && !this.playlists) {
			this.loading.account = true;
			this.electronService.send(EventType.ACCOUNT_PLAYLISTS);
		}
	}
}