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
        this.savePlaylists();
    }
    
    savePlaylists() {
        console.log('SHARED: Saving playlists...');
        this.storage.savePlaylists(this.playlists)
            .then(data => {
                console.log('saved playlists ', data);
            })
            .catch(err=> {
                console.log(err);
            });
    }
    
    removeAtIndex(i) {
        console.log('Removing playlist at ', i);
        if(confirm('Remove playlist ' + this.playlists[i].title + '?')) {
	    // let temp = this.playlists;
	    this.playlists.splice(i, 1);
	    // this.playlists = temp;
            for(let s = i; s < this.playlists.length; s++) {
                this.playlists[s].index = s;
            }
            this.savePlaylists();
	}
    }
    
    saveConfig() {
        console.log('SHARED: Saving configs...')
        this.storage.set('config', this.config);
    }
    
    sortPlaylists() {
        console.log('SHARED: Sorting playlists...');
        // this.playlists.sort(this.comparePlaylists);
	for(let i = 0; i < this.playlists.length; i++) {
	    this.playlists[i].index = i;
	}
    }
    
    comparePlaylists(a, b) {
	var a = (this.config.sortPlaylistsByName === 'channel') ? a.channelName.toUpperCase() : a.title.toUpperCase();
	var b = (this.config.sortPlaylistsByName === 'channel') ? b.channelName.toUpperCase() : b.title.toUpperCase();
        
	if(a < b) { return -1; }
	if(a > b) { return  1; }
	
	return 0;
    }
    
    loadConfig() {
        console.log('SHARED: we are loading config!');
	this.storage.get('config').then(data => {
            console.log('SHARED: Loaded CONFIG: ', data);
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
	    console.log('SHARED: NEXT IS CONFIG');
	    console.log(this.config);
            this.saveConfig();
            
	    //Set the always-on-top variable in the Main process to whatever is found on the config.
	    this.electronService.ipcRenderer.send('always-on-top', this.config.alwaysontop);
	    this.electronService.ipcRenderer.send('config-loaded');
            
            
	});
    }
    
    getPrefix()     { return this.prefix; }
    getConfig()     { return this.config; }
    getRequest()    { return this.request; }
    getPlaylists()  { return this.playlists; }
    getStorage()    { return this.storage; }
    
    isEmpty(obj){
        return Object.keys(obj).length === 0;
    }
}
