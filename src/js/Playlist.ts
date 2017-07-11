export class Playlist {
	url:string;
	name:string;

	constructor(url:string) {
		this.url = url;
	}

	public display() {
		console.log('displaying ' + this.url);
	}
}