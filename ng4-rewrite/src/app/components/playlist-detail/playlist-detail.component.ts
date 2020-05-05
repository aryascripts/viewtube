import { Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { Playlist } from '../../models/Playlist';
import { PlaylistsService } from './../../providers/playlist.service';

@Component({
	selector: 'app-playlist-detail',
	templateUrl: 'playlist-detail.component.html',
	styleUrls: ['playlist-detail.component.scss']
})
export class PlaylistDetailComponent implements OnChanges {

	@Input() playlist: Playlist;
	content: string = 'ADD TO PLAYLIST';
	btnClass = 'primary';

	constructor(
		private playlistService: PlaylistsService
	) {
		this.playlistService.customPlaylists.subscribe(this.checkForAlreadyAdded.bind(this));
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.playlist.currentValue && !changes.playlist.previousValue) {
			// value now exists
			this.checkForAlreadyAdded(this.playlistService.customPlaylists.value);
		}
	}

	checkForAlreadyAdded(playlists: Playlist[]) {
		const ids = playlists.map(playlist => playlist.id);
		if (this.playlist && ids.includes(this.playlist.id)) {
			this.content = 'ADDED TO PLAYLISTS';
			this.btnClass = 'secondary'
		}
		else {
			this.content = 'ADD TO PLAYLIST';
			this.btnClass = 'primary';
		}
	}

	addToMyPlaylists() {
		this.playlistService.addCustomPlaylist(this.playlist);
	}
}