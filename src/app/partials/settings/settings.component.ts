import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { DataStoreService } from './../../providers/data-store.service';
import { AppConfig, defaultConfig, PlaylistOrder } from './../../models/AppConfig';

@Component({
	selector: 'app-settings',
	templateUrl: 'settings.component.html',
	styleUrls: ['settings.component.scss']
})
export class SettingsComponent implements OnInit {

	playlistTypeOptions = [
		{display: 'Sequential', value: PlaylistOrder.SEQUENTIAL},
		{display: 'Random', value: PlaylistOrder.RANDOM}
	];

	autoPlayOptions = [
		{display: 'Yes', value: true},
		{display: 'No', value: false}
	];

	config: AppConfig = defaultConfig

	constructor(
		private database: DataStoreService
	){

	}

    ngOnInit(): void {
		this.getAppConfig()
			.catch(err => {
				// TODO error handle
			});
	}
	
	async getAppConfig() {
		this.config = await this.database.getAppConfig();
	}

	getWatchedAfter() {
		return Math.floor(this.config.watchedAfter * 100);
	}

	setWatchedAfter(event) {
		this.config.watchedAfter = (event.target.valueAsNumber / 100);
		this.saveConfig();
	}

	async saveConfig() {
		console.log('updating...');
		const res = await this.database.saveAppConfig(this.config);
		console.log('done.', res);
	}

	getConfigJson() {
		return JSON.stringify(this.config);
	}
}