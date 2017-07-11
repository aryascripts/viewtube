export class Playlist {
	url:string;
	name:string;

	constructor(url:string) {
		this.url = url;
		this.setName();
	}

	private setName() {
		//Set the name of this playlist based on YouTube API
	}

	public display() {
		console.log('displaying ' + this.url);
	}
}