import { Component } from '@angular/core';
import { SharedService } from './../../providers/shared.service/shared.service';
import * as fs from 'fs'
import { ElectronService } from './../../providers/electron.service';

@Component({
    templateUrl: './settings.component.html',
    selector: 'app-settings',
    styleUrls: ['./../../../assets/css/style.css',
                './../../../assets/css/photon.css',
                './../../../assets/css/iostoggles.css']
})
export class SettingsComponent {

    activeTab:number;
    config:any;
    data:any = {};
    percentage: number;
    holder:HTMLElement;

    constructor(private shared:SharedService, private electronService: ElectronService) {
        this.activeTab = 0;
        this.config = this.shared.getConfig();

        // Default data on start up for settings component
        this.data = {
                'themeOptions': [
                    {'id': 'light', 'name': 'Light'},
                    {'id': 'dark',  'name': 'Dark'}
                ],
                'themeSelected': { 'id': this.config.themeSelected.id },

                'defaultType': [
                    { 'id':'sequential', 'name':'Sequential'},
                    { 'id':'nonsequential', 'name': 'Non-sequential' }
                ],
                'defaultTypeSelected': {'id': this.config.defaultTypeSelected.id },

                'sortPlaylistsBy': [
                    { 'id': 'playlist', 'name': 'Playlist Name' },
                    { 'id': 'channel', 'name': 'Channel Name' }
                ],
                'sortPlaylistsBySelected': {'id': this.config.sortPlaylistsBySelected.id },

                'threshhold': this.config.threshhold,
                'alwaysOnTop' : this.config.alwaysOnTop,
                'markPrevious': this.config.markPrevious,
                'markNext': this.config.markNext,
                'skipWatched': this.config.skipWatched,
                'restart': this.config.restart,

                'afterNonsequentialFinishes': [
                    { 'id': 'next', 'name': 'Play Next' },
                    { 'id': 'random', 'name': 'Play Random Unwatched' },
                    { 'id': 'close', 'name': 'Close Player' }
                ],

                'afterNonsequentialFinishesSelected': { 'id': this.config.afterNonsequentialFinishesSelected.id },
                'showDesc': this.config.showDesc,

                'activeTab': 0
            }

            console.log(this.data);
            this.updatePercentage();
    }

    tabChange(n) {
        this.activeTab = n;
    }

    updateConfig() {
        console.log('saving config...');
        this.shared.saveConfig(this.data);
    }

    updatePercentage() {
        this.percentage = Math.floor(this.data.threshhold * 100);
        this.updateConfig();
    }

    holderSetup() {
        this.holder.ondragover = () => {
            return false;
        }

        this.holder.ondragleave = this.holder.ondragend = () => {
            return false;
        }

        this.holder.ondrop = (e) => {
            e.preventDefault();

            if(e.dataTransfer.files.length > 1) {
                alert('Only a single file is allowed.');
                return;
            }

            fs.readFile(e.dataTransfer.files[0].path, 'utf-8', (err, data) => {
                this.restoreData(data);
            })
        }
    }

    ngAfterViewInit() {
        this.holder = document.getElementById('restoreBox');
        this.holderSetup();
    }

    backupClick() {
        this.electronService.electronDialog.showSaveDialog({title:'Save Backup', buttonLabel:'Save'}, (path) => {
            if(path) {
                this.saveBackup(path);
            }
            
        });
    }

    saveBackup(path) {
        this.shared.getStoredPlaylists().then(data => {
              let info = JSON.stringify({
                  'config': this.shared.getConfig(),
                  'playlists': data
              });

              fs.writeFile(path, info, (err) => {
                  if(err) { confirm('Something went wrong while saving.' + err.message + '. Press OK to view current issues on GitHub'); }
              });      
        });

        }
    
    //Loads the data from the file provided.
    restoreData(data) {
        if(data === '') {
            alert('File is empty. Please try another file.');
            return;
        }
        let restored = JSON.parse(data);
        var msg;
        var restart = false;

        //if the config object exists
        if(restored.config) {
            this.shared.saveConfig(restored.config);
            msg = 'Settings were restored!';
            restart = true;
        } else { msg = 'Settings were not found in file.'; }

        //if the playlists object exists
        if(restored.playlists) {
            this.shared.setPlaylists(restored.playlists);
            msg += ' Playlists were restored!';
            restart = true;
        } else { msg += ' Playlists were not found in file.'; }

        //Add to the message to restart ViewTube
        // ipcRenderer.send('restart-app');
        if(restart) {
            this.electronService.ipcRenderer.send('config-loaded');
        }
    }
}
