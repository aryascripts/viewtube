import { Component } from '@angular/core';
import { SharedService } from './../../providers/shared.service/shared.service';
import { ActivatedRoute } from '@angular/router';
import { Playlist } from './../../objects/Playlist';
import { ElectronService } from './../../providers/electron.service';
import { OnInit } from '@angular/core';

import YouTubePlayer from 'youtube-player';

@Component({
	styles: [],
	template: `<div style="width:100vw;height:100vh;background-color:#000;" id='player'></div>`,
	selector: 'youtube'
})

export class VideoComponent implements OnInit {

	player: YouTubePlayer;
	sendOnUnload: boolean;
	id:string;
	time:string;

	constructor(private electron:ElectronService,
				private shared:SharedService,
				private route:ActivatedRoute) {
		console.log('switching windows');

		this.sendOnUnload = true;

		console.log(this.route.snapshot.paramMap.get('id'));

		this.id = this.route.snapshot.paramMap.get('id');
		this.time = this.route.snapshot.paramMap.get('time');
	}

	ngAfterViewInit() {
		console.log('running');
		this.startPlayer();
	}

	ngOnInit() {
		this.electron.remote.getCurrentWindow().webContents.executeJavaScript(`document.getElementById('removeMe').innerHTML = ''`);
		this.electron.remote.getCurrentWindow().webContents.insertCSS(`	::-webkit-scrollbar {display: none;}`);
	}
	
	startPlayer() {
		this.player = YouTubePlayer('player',
		{
			videoId: this.id,
			playerVars: {
				start: this.time
			}
		});

		this.player.playVideo();

		this.player.on('stateChange', (event) => {
			console.log(event);
			if(event.data === 0) {
				console.log('video ended... queuing send command');
				this.sendOnUnload = false;
				this.electron.ipcRenderer.send('next-video', {
					'from': this.id
				});
			}
		});

		this.player.on('stateChange', (event) => {
			console.log(event);
			if(event.data === 0) {
				console.log('video ended... queuing send command');
				this.sendOnUnload = false;
				this.electron.ipcRenderer.send('next-video', {
					'from': this.id
				});
			}
		});

		this.electron.remote.getCurrentWindow().on('close', (event) => {

			this.player.getCurrentTime().then(data => {
				var sendInfo = {
					'time': data,
					'id': this.id
				}

				if(this.sendOnUnload) {
					this.electron.ipcRenderer.send('video-closed', sendInfo);
				}
				
			})

		});
	}
}