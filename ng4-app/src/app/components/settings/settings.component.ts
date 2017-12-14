import { Component } from '@angular/core';
import { SharedService } from './../../providers/shared.service/shared.service';

@Component({
    templateUrl: './settings.component.html',
    selector: 'app-settings',
    styleUrls: ['./../../../assets/css/style.css',
                './../../../assets/css/photon.css']
})
export class SettingsComponent {

    activeTab:number;
    
    constructor(private shared:SharedService) {
        this.activeTab = 0;
    }

    tabChange(n) {
        this.activeTab = n;
    }

    
    
}
