import { Injectable } from '@angular/core';
import { Playlist } from '../models/Playlist';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs';

@Injectable()
export default class PlaylistsService {

	public myPlaylists: ReplaySubject<Playlist[]>;
	public myName: ReplaySubject<string>;

	constructor() {
		this.myPlaylists = new ReplaySubject(1);
		this.myName = new ReplaySubject(1);
	}

	addAccountPlaylists(resp: any) {

		if(resp.status != 200 || resp.data.pageInfo.resultsPerPage <= 0) {
			console.error('Error. We were unable to receive data from YouTube.', resp);
			return;
		}

		this.setMyName(resp.data.items[0].snippet.channelTitle);

		console.log('response: ', resp);
		const lists:{} = resp['data']['items'];

		// setMyName(lists[0])
		let plists: Playlist[] = [];
		Object.entries(lists).forEach(
			([key, info]) => {
				plists.push(new Playlist(info));
			});
			this.myPlaylists.next(plists);
	}

	setMyName(name: string) {
		this.myName.next(name);
	}
}