import { Injectable } from '@angular/core';
import { Playlist } from '../models/Playlist';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export default class PlaylistsService {

	private playlists: BehaviorSubject<Playlist[]>;
	private myPlaylists: BehaviorSubject<Playlist[]>;

	constructor() {
		this.myPlaylists = <BehaviorSubject<Playlist[]>>new BehaviorSubject([]);
		this.playlists = <BehaviorSubject<Playlist[]>>new BehaviorSubject([]);
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

	getMyPlaylists() {
		return this.myPlaylists.asObservable();
	}
}