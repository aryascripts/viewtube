import { HttpRequest } from './../helpers/HttpRequest';
import { Storage } from './../helpers/Storage';


const angular = require('angular');
angular.module('viewTube', [require('angular-route'), require('angular-animate'), require('angular-route')])

.service('shared', function() {
	
	var btnAdd:HTMLElement = document.getElementById('btn-url-add');
	var urlInput:HTMLElement = document.getElementById('url-input-container');
	var wrapper:HTMLElement = document.getElementById('main-wrapper');
	var template = (<HTMLTemplateElement>document.getElementById('playlist-template'));

	var playlists = [];

	var request = new HttpRequest();
	var storage = new Storage();
	const prefix:string = 'https://www.youtube.com/playlist?list=';

	var observers = [];
	var noPlaylists;
	
	var notify = () => {
		if(observers.length > 0) {
			angular.forEach(observers, function(callback) {
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
		},

		getPlaylists: 	() => playlists,
		btnAdd: 		() => btnAdd,
		urlInput: 		() => urlInput,
		wrapper: 		() => wrapper,

		request: 		() => request,
		storage: 		() => storage,
		prefix: 		() => prefix,
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
		.when('/playlist/:id', {
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

