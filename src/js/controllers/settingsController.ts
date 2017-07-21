import {ipcRenderer} from 'electron';

require('angular').module('viewTube')
.controller('settingsController', settingsController);

function settingsController($scope, shared, $timeout) {
	var display = document.getElementById('amt');
	var threshhold = <HTMLInputElement>document.getElementById('threshhold');
	var alwaysOnTop = <HTMLInputElement>document.getElementById('alwaysontop');
	var markPrevious = <HTMLInputElement>document.getElementById('markPrevious');

	var config;

	$timeout(() => {
		config = shared.config();
		$scope.sliderValue = config.watchTimeThresh*100;
		threshhold.value = config.watchTimeThresh;
		
		alwaysOnTop.checked = config.alwaysontop;
	});

	$scope.slider = function() {
		$scope.sliderValue = Math.floor(threshhold.value*100);
		if(config) {
			config.watchTimeThresh = threshhold.value;
			saveConfig();
		}
	}

	$scope.getConfig = function() {
		console.log(shared.config());
	}

	$scope.onTopChange = function() {
		config.alwaysontop = alwaysOnTop.checked;
		saveConfig();
		ipcRenderer.send('always-on-top', alwaysOnTop.checked);
	}

	$scope.watchedToggle = function() {
		config.markPrevious = markPrevious.checked;
		saveConfig();
	}

	function saveConfig() {
		shared.setConfig(config);
	}
}