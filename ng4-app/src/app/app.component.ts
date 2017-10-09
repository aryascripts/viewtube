import { Component } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { SharedService } from './providers/shared.service/shared.service';
import { Playlist } from './objects/Playlist';
import { api_key } from './objects/api_key';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./../assets/css/photon.css',
              './../assets/css/style.css']
})
export class AppComponent {

    showForm:boolean;                    // Keeps track whether the form is showing or not
    plusOrMinus:string;                  // class id for either the plus or minus button
    urlBox:string;
    
    constructor(private electronService: ElectronService, private shared: SharedService) {
        
        if (electronService.isElectron()) {
            console.log('Mode electron');
            // Check if electron is correctly injected (see externals in webpack.config.js)
            console.log('c', electronService.ipcRenderer);
            // Check if nodeJs childProcess is correctly injected (see externals in webpack.config.js)
            console.log('c', electronService.childProcess);
        } else {
            console.log('Mode web');
        }
        this.showForm = true;
        this.plusOrMinus = 'icon-minus-circled';
        this.urlBox = '';
    }

    // Called when the "add" button is pressed (or when video is added)
    toggleShowForm() {
        this.showForm = !this.showForm;
        this.plusOrMinus = (this.showForm) ? 'icon-minus-circled' : 'icon-plus-circled'
    }

    //Called when user presses "add playlist" check in the form
    addFromForm() {

        
        if(this.urlBox.startsWith(this.shared.getPrefix())) {
            this.getPlaylistInfo(this.urlBox.split('=')[1])
                .then(this.addPlaylist.bind(this))
                .catch(error => {
                    console.log(error);
                })
            
	}
	//Not a valid url for playlist
	else {
	    console.log(this.shared.getPrefix());
	    alert('Please check URL matches format.\nExample: ' + this.shared.getPrefix() + '...');
	}
    }

    addPlaylist(data, last = -1, watchingId = '', watchingTime = -1, watchedArr = [], partialArr = []) {
        console.log(data);
        
        let plist = new Playlist(data);
	plist.lastCompleted = last;
	plist.watchingId = watchingId;
        plist.sequential = this.shared.getConfig().sequential;
	plist.watchingTime = watchingTime;
	plist.watched = watchedArr;
	plist.partial = partialArr;


        this.shared.addingPlaylist(plist);

    }
    
    getPlaylistInfo(id:string) {
        let info;
        let location = 'https://www.googleapis.com/youtube/v3/playlists';
        let headers = {
	    'id': id,
	    'part':'snippet,contentDetails',
	    'key': api_key,
	}
        
        //This is a promise (unresolved)
        return this.shared.getRequest().getResponse(location, headers);
    }
}
