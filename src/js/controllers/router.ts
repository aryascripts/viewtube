import { HttpRequest } from './../helpers/HttpRequest';
import { Storage } from './../helpers/Storage';


const angular = require('angular');
angular.module('viewTube', [require('angular-route')])

.service('shared', function() {
	
	var btnAdd:HTMLElement = document.getElementById('btn-url-add');
	var urlInput:HTMLElement = document.getElementById('url-input-container');
	var wrapper:HTMLElement = document.getElementById('main-wrapper');
	var template = (<HTMLTemplateElement>document.getElementById('playlist-template'));

	var playlists = [];

	var request = new HttpRequest();
	var storage = new Storage();
	const prefix:string = 'https://www.youtube.com/playlist?list=';

	return {
		playlists: () => playlists,

		btnAdd: () => btnAdd,
		urlInput: () => urlInput,
		wrapper: () => wrapper,

		request: () => request,
		storage: () => storage,
		prefix: () => prefix

	}
})

.config($routeProvider => {
	$routeProvider
	//home page displays all the playlists
		.when('/', {
			templateUrl : 'components/home.html',
			controller : 'homeController'
		})

	//playlist page displays videos in a single playlist
		.when('/playlist', {
			templateUrl : 'components/playlist.html',
			controller : 'playlistController'
		})

	//video page actually plays the current video (or any video)
		.when('/video', {
			templateUrl : 'components/video.html',
			controller : 'videoController'
		})

	//modifying settings
		.when('/settings', {
			templateUrl : 'components/settings.html',
			controller : 'settingsController'
		});
});

