import { DatabaseObject } from './DatabaseObject';

export enum PlaylistOrder {
	SEQUENTIAL = 'sequential',
	RANDOM = 'random'
}

export interface AppConfig extends DatabaseObject{
	autoplay: boolean;
	defaultType: PlaylistOrder;
	watchedAfter: number;
}

export const defaultConfig: AppConfig = {
	autoplay: true,
	defaultType: PlaylistOrder.SEQUENTIAL,
	watchedAfter: 0.95
};

export enum PlaylistType {
	CUSTOM = 'custom',
	ACCOUNT = 'account'
}



/**
 * SETTINGS PER PLAYLIST
 */
export interface PlaylistSettings {
	type: PlaylistType;
	order: PlaylistOrder;
	resumeBehavior: ResumeBehavior;
	markPreviousWatched: boolean;
	markNextUnwatched: boolean;
}

export enum ResumeBehavior {
	LAST_PLAYED = 'last-played',
	FIRST_UNWATCHED = 'first-unwatched'
}

export const defaultPlaylistSettings: PlaylistSettings = {
	type: PlaylistType.CUSTOM,
	order: PlaylistOrder.SEQUENTIAL,
	resumeBehavior: ResumeBehavior.FIRST_UNWATCHED,
	markPreviousWatched: true,
	markNextUnwatched: false
}