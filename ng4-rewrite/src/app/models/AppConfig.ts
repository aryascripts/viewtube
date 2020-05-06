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