export class Storage {
	storage = require('electron-json-storage');

	public savePlaylists(arr) {
		var data = { 'playlists': [] }

		for(let i = 0; i < arr.length; i++) {
			data.playlists.push({
				'id': arr[i].getId(),
				'lastVideo': arr[i].getLastVideoNumber()
			});
		}
		this.storage.set('playlists', data, error => {
			if(error) throw error;
		});
	}

	public getPlaylists() {
		return new Promise(
			(resolve, reject) => {
				this.storage.get('playlists', (error, data) => {
					if(error) { reject(error); }
					resolve(data);
				});
			});
	}
}
