import { Injectable } from '@angular/core';
import { Playlist } from '../models/Playlist';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs';

@Injectable()
export default class PlaylistsService {

	public myPlaylists: ReplaySubject<Playlist[]>;

	constructor() {
		this.myPlaylists = new ReplaySubject(1);
	}

	addAccountPlaylists(resp: any) {
		const lists:{} = resp['data']['items'];
		let plists: Playlist[] = [];
		Object.entries(lists).forEach(
			([key, info]) => {
				plists.push(new Playlist(info));
			});
			this.myPlaylists.next(plists);
	}
}