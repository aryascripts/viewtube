import { HttpRequest } from './../helpers/HttpRequest';
import { Storage } from './../helpers/Storage';
import {ipcRenderer} from 'electron';

const angular = require('angular');
angular.module('viewTube', [require('angular-route'), require('angular-animate'), require('angular-route')])

.service('shared', function() {
	
	var btnAdd:HTMLElement = document.getElementById('btn-url-add');
	var urlContainer:HTMLElement = document.getElementById('url-input-container');
	var wrapper:HTMLElement = document.getElementById('main-wrapper');
	var template = (<HTMLTemplateElement>document.getElementById('playlist-template'));
	const prefix:string = 'https://www.youtube.com/playlist?list=';

	var request = new HttpRequest();
	var storage = new Storage();
	var observers = [];
	var noPlaylists;

	var config;
	storage.get('config').then(data => {
			if(isEmpty(data)) {
				console.log('LOADING DEFAULT CONFIG');
				config = {
					'theme':'light', 					// light | dark
					'autoplay':false,
					'iFrame':true,
					'restart':false,
					'alwaysOnTop':false,
					'sequential': true,
					'threshhold': 0.90,					// 0.5 - 0.95
					'sortPlaylistsByName':'playlist', 	// playlist | channel
					'markPrevious': true,
					'markNext': true,
					'skipWatched': false,
					'warnBeforeDelete': true,
					'showDesc': true,
					'afterNonsequentialFinishes': 'next' 		// next | random | close
				}
			} else {
				config = data;
			}
			console.log('sending event alwaysontop... ' + config.alwaysontop);
			
			console.log('NEXT IS CONFIG');
			console.log(config);

			ipcRenderer.send('always-on-top', config.alwaysontop);
			ipcRenderer.send('config-loaded');


		});

	var playlists = [];

	var notify = () => {
		if(observers.length > 0) {
			angular.forEach(observers, function(callback) {
				console.log('NOTIFYING');
				callback();
			});
		}
	}

	return {
		setPlaylists: (value) => {
			return new Promise((resolve, reject) => {
				storage.savePlaylists(value)
					.then(saved => {
						playlists = value;
						notify();
						resolve(saved);
					})
					.catch(error => {
						reject(error);
					})
			});
			
		},
		registerObserver: (callback) => {
			observers.push(callback);
		},
		setConfig: (value) => {
			storage.set('config', value)
				.then(data => {
					config = value;
				});
		},

		config: 		() => config,
		getPlaylists: 	() => playlists,
		btnAdd: 		() => btnAdd,
		urlCont: 		() => urlContainer,
		wrapper: 		() => wrapper,

		request: 		() => request,
		storage: 		() => storage,
		prefix: 		() => prefix,
	}

	function isEmpty(obj){
		return Object.keys(obj).length === 0;
	}
})

.config($routeProvider => {
	$routeProvider
	//home page displays all the playlists
		.when('/', {
			templateUrl : 'components/loading.html',
			controller : 'loadingController'
		})

	//home page displays all the playlists
		.when('/home', {
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

