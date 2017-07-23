export class Storage {
	storage = require('electron-json-storage');

	public savePlaylists(playlists) {
		console.log('saving playlists...')
		return new Promise(
			(resolve, reject) => {
				var data = { 'playlists': [] }

				for(let i = 0; i < playlists.length; i++) {
					let watchedIds = [];

					data.playlists.push({
						'id': playlists[i].id,
						'lastCompleted': playlists[i].lastCompleted,
						'watchingTime': playlists[i].watchingTime,
						'watchingId': playlists[i].watchingId,
						'watched': playlists[i].watched,
						'sequential': playlists[i].sequential
					});
				}
				//if resolved, it sends back the same playlists that came in
				//for reuse.
				this.storage.set('playlists', data, error => {
					if(error) { reject(error);	} 
					resolve(playlists);
				});
			}
		);	
	}

	public saveConfig(values) {
		return new Promise(
			(resolve, reject) => {
				this.storage.set('config', values, error => {
					if(error) { reject(error); }
					resolve(values);
				});
			}
		);
	}

	public get(obj) {
		console.log('loading object...' + obj);
		return new Promise(
			(resolve, reject) => {
				this.storage.get(obj, (error, data) => {
					if(error) { reject(error); }
					console.log(data);
					resolve(data);
				});
			}
		);
	}
	public set(str, obj) {
		console.log('setting object...' + obj);
		return new Promise(
			(resolve, reject) => {
				this.storage.set(str, obj, error => {
					if(error) { reject(error); }
					resolve(str);
				});
			}
		);
	}
}
