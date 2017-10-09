import { Injectable } from '@angular/core';
import { HttpRequest } from './HttpRequest';
import { Storage } from './Storage';
import { ElectronService } from './../electron.service';
import { Playlist } from './../../objects/Playlist';

@Injectable()
export class SharedService {

    request: HttpRequest;
    playlists: any;
    storage: Storage;
    config: any;

    readonly prefix:string = 'https://www.youtube.com/playlist?list=';
    
    constructor(public electronService: ElectronService) {
        this.request = new HttpRequest();
        this.storage = new Storage();
        this.playlists = [];
        this.config = {}
    }

    addingPlaylist(list: Playlist) {
        this.playlists.push(list);
        console.log(this.playlists);
        this.sortPlaylists();
    }

    sortPlaylists() {
        console.log('sorting playlists...');
    }

    loadConfig() {
        console.log('we are loading config!');
	this.storage.get('config').then(data => {
			if(this.isEmpty(data)) {
				console.log('LOADING DEFAULT CONFIG');
				
				//This is the default config thati s loaded in case there is no config.
				this.config = {
					'theme':'light', 					// light | dark
					'autoplay':false,
					'iFrame':true,
					'restart':false,
					'alwaysOnTop':false,
					'sequential': true,
					'threshhold': 0.90,					// 0.5 - 0.95
					'sortPlaylistsByName':'playlist', 	// playlist | channel
					'markPrevious': true,
					'markNext': true,
					'skipWatched': false,
					'warnBeforeDelete': true,
					'showDesc': true,
					'afterNonsequentialFinishes': 'next' 		// next | random | close
				}
			} else {
				this.config = data;
			}
			console.log('sending event alwaysontop... ' + this.config.alwaysontop);
			console.log('NEXT IS CONFIG');
			console.log(this.config);

			//Set the always-on-top variable in the Main process to whatever is found on the config.
			this.electronService.ipcRenderer.send('always-on-top', this.config.alwaysontop);
			this.electronService.ipcRenderer.send('config-loaded');


		});
    }

    getPrefix()     { return this.prefix; }
    getConfig()     { return this.config; }
    getRequest()    { return this.request; }
    getPlaylists()  { return this.playlists; }

    isEmpty(obj){
        return Object.keys(obj).length === 0;
    }
}
