import { HttpRequest } from './../helpers/HttpRequest';
import { Storage } from './../helpers/Storage';


const angular = require('angular');
angular.module('viewTube', [require('angular-route'), require('angular-animate'), require('angular-route')])

.service('shared', function() {
	
	var btnAdd:HTMLElement = document.getElementById('btn-url-add');
	var urlInput:HTMLElement = document.getElementById('url-input-container');
	var wrapper:HTMLElement = document.getElementById('main-wrapper');
	var template = (<HTMLTemplateElement>document.getElementById('playlist-template'));
	const prefix:string = 'https://www.youtube.com/playlist?list=';

	var request = new HttpRequest();
	var storage = new Storage();
	var observers = [];
	var noPlaylists;

	var config = [];

	var playlists = [];

	var notify = () => {
		if(observers.length > 0) {
			angular.forEach(observers, function(callback) {
				callback();
			});
		}
	}

	//this saves the playlist to database, and if successful,
	//also sets the local playlist object (above) and notifies
	//any observers.
	var savePlaylistsToStorage = (plists) => {
		storage.savePlaylists(plists)
			.then(data => {
				playlists = plists;
				notify();
			});
	}

	return {
		setPlaylists: (value) => {
			savePlaylistsToStorage(value);
		},
		registerObserver: (callback) => {
			observers.push(callback);
		},
		setConfig: (value) => {
			value.autoplay = true;
			config = value;

			console.log(config);
			storage.set('config', value);
		},

		config: 		() => config,
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

