import { Component } from '@angular/core';
import { SharedService } from './../../providers/shared.service/shared.service';

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

    constructor(private shared:SharedService) {
        this.activeTab = 0;
        this.config = this.shared.getConfig();
        console.log(this.config);

        // Default data on start up for settings component
        this.data = {
                'themeOptions': [
                    {'id': 'light', 'name': 'Light'},
                    {'id': 'dark',  'name': 'Dark'}
                ],
                'themeSelected': { 'id': this.config.themeSelected },

                'defaultType': [
                    { 'id':'sequential', 'name':'Sequential'},
                    { 'id':'nonsequential', 'name': 'Non-sequential' }
                ],
                'defaultTypeSelected': {'id': this.config.defaultTypeSelected},

                'sortPlaylistsBy': [
                    { 'id': 'playlist', 'name': 'Playlist Name' },
                    { 'id': 'channel', 'name': 'Channel Name' }
                ],
                'sortPlaylistsBySelected': (this.config.sortPlaylistsByName === 'playlist') ? 
                    {'id': 'playlist'} : {'id': 'channel'},

                'threshhold': this.config.threshhold,
                'percentage': Math.floor(this.config.threshhold * 100),

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

                'afterNonsequentialFinishesSelected': { 'id': this.config.afterNonsequentialFinishesSelected },
                'showDesc': this.config.showDesc,

                'activeTab': 0
            }

            console.log(this.data);
    }

    tabChange(n) {
        this.activeTab = n;
    }

    updateConfig() {
        console.log('saving config...');
        this.shared.saveConfig(this.data);
    }

    
    
}
