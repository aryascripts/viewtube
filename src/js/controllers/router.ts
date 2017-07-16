import { HttpRequest } from './../helpers/HttpRequest';
import { Storage } from './../helpers/Storage';


const angular = require('angular');
angular.module('viewTube', [require('angular-route'), require('angular-animate')])

.service('shared', function() {
	
	var btnAdd:HTMLElement = document.getElementById('btn-url-add');
	var urlInput:HTMLElement = document.getElementById('url-input-container');
	var wrapper:HTMLElement = document.getElementById('main-wrapper');
	var template = (<HTMLTemplateElement>document.getElementById('playlist-template'));

	var playlists = [];
	var current

	var request = new HttpRequest();
	var storage = new Storage();
	const prefix:string = 'https://www.youtube.com/playlist?list=';

	var observers = [];

	var notify = () => {
		if(observers.length > 0) {
			angular.forEach(observers, function(callback) {
				console.log('performing callbacks...');
				callback();
			});
		}
	}

	return {
		setPlaylists: (value) => {
			playlists = value;
			notify();
		},
		registerObserver: (callback) => {
			observers.push(callback);
			console.log('registered observer');
		},

		getPlaylists: 	() => playlists,
		btnAdd: 		() => btnAdd,
		urlInput: 		() => urlInput,
		wrapper: 		() => wrapper,

		request: 		() => request,
		storage: 		() => storage,
		prefix: 		() => prefix,
		setCurrent:		(value) => current = value
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

