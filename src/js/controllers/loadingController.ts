import {ipcRenderer} from 'electron';

require('angular').module('viewTube')
.controller('loadingController', loadingController);

function loadingController($scope, $location) {

	ipcRenderer.on('config-loaded', (event, data) => {
		console.log('received event to load home page');
		$location.url('/home');
		$scope.$apply();
	});
}