import { DatabaseObject } from './DatabaseObject';

export interface VideoMetadata extends DatabaseObject {
	videoId: string;
	playlistId: string;
	seconds?: number;
}