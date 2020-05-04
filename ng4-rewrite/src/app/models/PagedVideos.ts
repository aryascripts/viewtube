import { Video } from './Video';

export class PagedVideos {

	videos: Video[] = [];
	nextPage: string;
	totalCount: number;
	newObject: boolean = true;

	addVideos(videos: Video[]) {
		this.newObject = false;
		this.videos = [...this.videos, ...videos];
	}

}