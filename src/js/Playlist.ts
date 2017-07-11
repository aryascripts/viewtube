export class Playlist {
	id:string;
	name:string;

	constructor(id:string) {
		this.id = id;
		this.setName();
	}

	private setName() {
		//Set the name of this playlist based on YouTube API
	}

	public display() {
		console.log('displaying ' + this.id);
	}
}