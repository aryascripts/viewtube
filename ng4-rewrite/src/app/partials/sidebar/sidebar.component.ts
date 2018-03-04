import { Component, OnInit } from '@angular/core';
import { OAuthService } from './../../providers/oauth.service';
import { ElectronService } from '../../providers/electron.service';
import { Playlist } from '../../models/Playlist';

@Component({
	selector: 'app-sidebar',
	templateUrl: 'sidebar.component.html',
	styleUrls: ['sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
	sidebarHeader: string = 'Sign In With Google';
	
	playlist:Playlist = new Playlist({
		title: 'Some playlist on YouTubewith Long title',
		channelName: 'Aman Bhimani',
		description: 'This is some description of the playlist listed here.'
	});

	constructor(private electronService: ElectronService) {

	}
	ngOnInit() {


	}

	loginHandler() {
		this.electronService.ipcRenderer.send('authorize');
	}
}