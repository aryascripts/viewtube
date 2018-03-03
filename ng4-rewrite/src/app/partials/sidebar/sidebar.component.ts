import { Component, OnInit } from '@angular/core';
import { OAuthService } from './../../providers/oauth.service';
import { ElectronService } from '../../providers/electron.service';

@Component({
	selector: 'app-sidebar',
	templateUrl: 'sidebar.component.html',
	styleUrls: ['sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
	user: string = 'Aman Bhimani';

	constructor(private electronService: ElectronService) {

	}
	ngOnInit() { }

	loginHandler() {
		this.electronService.ipcRenderer.send('authorize');
	}
}