import { Component, OnInit } from '@angular/core';
import { SharedService } from './../../providers/shared.service/shared.service';
import { ElectronService } from './../../providers/electron.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: []
})
export class LoadingComponent {

    router: Router;
    
    
    constructor(private shared:SharedService,
                private electronService:ElectronService,
                router:Router) {
        this.router = router;
  	console.log('loading component is created');
        //Register all the events this controlled needs to handle
        this.registerEvents();
        
        //load the config file
  	shared.loadConfig();
    }
    
    registerEvents() {
        //once the config is loaded, we change the "location" of the window to /home
        //to now load the home page.
        this.electronService.ipcRenderer.on('load-home', (event, data) => {
	    console.log('received event to load home page');
            this.router.navigate(['/home']);
        });
    }
    
}
