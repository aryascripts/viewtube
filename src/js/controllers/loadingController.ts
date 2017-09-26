/****************************************************************
File: loadingController.ts
Purpose: Controller that manages loading the Angular views. If the computer
is really slow, then this page will just say "Loading" until the other data loads.
Author: Aman Bhimani
*****************************************************************/

import {ipcRenderer} from 'electron';

require('angular').module('viewTube')
.controller('loadingController', loadingController);

function loadingController($scope, $location) {

	console.log('loading...');

	//once the config is loaded, we change the "location" of the window to /home
	//to now load the home page.
	ipcRenderer.on('config-loaded', (event, data) => {
		console.log('received event to load home page');
		$location.url('/home');
		$scope.$apply();
	});
}
