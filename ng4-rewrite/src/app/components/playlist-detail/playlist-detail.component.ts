import { Component, Input} from '@angular/core';
import { Playlist } from '../../models/Playlist';

@Component({
	selector: 'app-playlist-detail',
	templateUrl: 'playlist-detail.component.html',
	styleUrls: ['playlist-detail.component.scss']
})
export class PlaylistDetailComponent {

	@Input() playlist: Playlist;

	constructor() {

	}
}