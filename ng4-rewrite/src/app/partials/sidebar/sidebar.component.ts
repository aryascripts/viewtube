import { Component, OnInit, NgZone } from '@angular/core';
import { AppElectronService } from '../../providers/electron.service';
import { Playlist } from '../../models/Playlist';
import { GoogleApiService } from '../../providers/googleapi.service';
import { PlaylistsService } from '../../providers/playlist.service';
import { UserService } from '../../providers/user.service';

@Component({
	selector: 'app-sidebar',
	templateUrl: 'sidebar.component.html',
	styleUrls: ['sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
	sidebarHeader: string = 'Sign In With Google';
	playlists:Playlist[];
	loading: boolean;

	constructor(private googleApiService: GoogleApiService,
							private playlistsService: PlaylistsService,
							private zone:NgZone,
							private userService: UserService,
							private electronService: AppElectronService) {
		this.loading = false
	}

	ngOnInit() {
		this.registerEvents()
	}

	registerEvents() {
		this.playlistsService.myPlaylists
			.subscribe(value => {
					this.playlists = value;
			})

		this.userService.name
			.subscribe(value => {
				this.sidebarHeader = value;
			})

		// this.electronService.ipcRenderer.on('login-cancelled', (event) => {
		// 	console.log(event);
		// 	this.setLoading(true)
		// })

		// this.electronService.ipcRenderer.on('my-playlists', (event) => {
		// 	this.setLoading(false)
		// })
	}

	loginHandler() {
		this.loading = true
		this.googleApiService.login()
	}

	setLoading(val:boolean) {
		this.zone.run(() => {
			this.loading = val
		})
	}
}