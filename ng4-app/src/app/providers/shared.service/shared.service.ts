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
    
    saveConfig(data) {
        console.log('SHARED: Saving configs...')
        this.storage.set('config', data);
        this.config = data;
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
        		
        		//This is the default config that is loaded in case there is no config.
        		this.config = {
        		    'themeSelected':{'id': 'light'}, 					// light | dark
        		    'autoplay':false,
        		    'iFrame':true,
        		    'restart':false,
        		    'alwaysOnTop':false,
        		    'defaultTypeSelected': {'id':'sequential'},
        		    'threshhold': 0.90,					// 0.5 - 0.95
        		    'sortPlaylistsBySelected': { 'id':'playlist'},
        		    'markPrevious': true,
        		    'markNext': true,
        		    'skipWatched': false,
        		    'warnBeforeDelete': true,
        		    'showDesc': true,
        		    'afterNonsequentialFinishesSelected': {'id':'next'}
        		}
    	    } else {
    		    this.config = data;
    	    }
            this.saveConfig(this.config);
            
	    //Set the always-on-top variable in the Main process to whatever is found on the config.
	    this.electronService.ipcRenderer.send('always-on-top', this.config.alwaysontop);
	    this.electronService.ipcRenderer.send('config-loaded');
            
            
	});
    }

    setPlaylists(val) {
            this.storage.savePlaylists(val)
                .then(saved => {

                })
                .catch(error => {
                    alert('There was a problem setting playlists');
                })
    }

    getStoredPlaylists() { return this.storage.get('playlists'); }
    
    getPrefix()     { return this.prefix; }
    getConfig()     { return this.config; }
    getRequest()    { return this.request; }
    getPlaylists()  { return this.playlists; }
    getStorage()    { return this.storage; }
    
    isEmpty(obj){
        return Object.keys(obj).length === 0;
    }
}
