export enum PlaylistOrder {
	SEQUENTIAL = 'sequential',
	RANDOM = 'random'
}

export interface AppConfig {
	autoplay: boolean;
	defaultType: PlaylistOrder;
}

export const defaultConfig: AppConfig = {
	autoplay: true,
	defaultType: PlaylistOrder.SEQUENTIAL
};