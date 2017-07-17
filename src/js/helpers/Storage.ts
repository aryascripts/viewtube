export class Storage {
	storage = require('electron-json-storage');

	public savePlaylists(arr) {
		return new Promise(
			(resolve, reject) => {
				var data = { 'playlists': [] }

				for(let i = 0; i < arr.length; i++) {
					data.playlists.push({
						'id': arr[i].getId(),
						'lastVideo': arr[i].getLastVideoNumber()
					});
				}
				this.storage.set('playlists', data, error => {
					if(error) { reject(error);	} 
					resolve(arr);
				});
			}
		);
		
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
