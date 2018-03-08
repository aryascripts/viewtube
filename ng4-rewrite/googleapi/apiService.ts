const {google} = require('googleapis');

export class YoutubeApiService {

	oAuthClient: any;
	youtube: any;
	myChannelId: string;

	constructor(client: any) {
		this.youtube = google.youtube({
			version: 'v3',
			auth: client
		});
		this.myChannelId = null;
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
}