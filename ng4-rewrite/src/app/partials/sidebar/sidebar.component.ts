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
	
	playlists:Playlist[] = [];

	constructor(private electronService: ElectronService) {

	}
	ngOnInit() {
		this.playlists = [
			new Playlist({
			title: 'Some playlist on YouTubewith Long title',
			channelName: 'Aman Bhimani',
			description: 'This is some description of the playlist listed here.'
		}),
		new Playlist({
			title: 'Another playlist',
			channelName: 'Aman Bhimani',
			description: 'This is some description of the playlist listed here.'	
		}),
		new Playlist({
			title: 'Third playlist in this list',
			channelName: 'Aman Bhimani',
			description: 'This is some description of the playlist listed here.'	
		}),
		new Playlist({
			title: 'Some playlist in here on Youtube similar to first',
			channelName: 'Aman Bhimani',
			description: 'This is some description of the playlist listed here.'	
		}),
		new Playlist({
			title: 'Another playlist that I am adding',
			channelName: 'Aman Bhimani',
			description: 'This is some description of the playlist listed here.'	
		}),
		new Playlist({
			title: 'You must be addicted to Youtube!',
			channelName: 'Aman Bhimani',
			description: 'This is some description of the playlist listed here.'	
		})];
	}

	loginHandler() {
		this.electronService.ipcRenderer.send('authorize');
	}
}