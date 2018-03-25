const {google} = require('googleapis');

export class YoutubeApiService {

	oAuthClient: any;
	youtube: any;

	constructor(client: any) {
		this.youtube = google.youtube({
			version: 'v3',
			auth: client
		});
	}

	async getAccountPlaylists(nextPage:string = null) {
		return new Promise((resolve, reject) => {
			let request = {
				part: 'id,snippet,contentDetails',
				mine: true,
				maxResults: 50,
				headers: {}
			}
			if(nextPage) request['pageToken'] = nextPage;

			this.youtube.playlists.list(request,
				(err, res) => {
					if(err) reject(err); 
					resolve(res);
				});

		})
	}

	async searchPlaylists(params:{playlist: string, channel: string, nextPage:string}) {
		return new Promise((resolve, reject) => {
			let request = {
				part: 'snippet',
				maxResults: 25,
				headers: {},
				q: params.playlist
			}
			if(params.nextPage) request['pageToken'] = params.nextPage

			this.youtube.search.list(request, 
				(err, res) => {
					if(err) reject(err)
					resolve(res)
				})
		})
	}
}