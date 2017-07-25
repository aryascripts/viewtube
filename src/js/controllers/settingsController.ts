import {ipcRenderer} from 'electron';

const {remote} = require('electron');
const {dialog} = require('electron').remote;
const fs = require('fs');


require('angular').module('viewTube')
.controller('settingsController', settingsController);

function settingsController($scope, shared, $timeout) {
	var config = shared.config();
	console.log(config);

	const holder = document.getElementById('restoreBox');
	
	$scope.data = {
		'themeOptions': [
			{'id': 'light', 'name': 'Light'},
			{'id': 'dark',  'name': 'Dark'}
		],
		'themeSelected': { 'id': config.theme },

		'defaultType': [
			{ 'id':'sequential', 'name':'Sequential'},
			{ 'id':'nonsequential', 'name': 'Non-sequential' }
		],
		'defaultTypeSelected': (config.sequential) ?
			{'id': 'sequential'} : {'id': 'nonsequential'},

		'sortPlaylistsBy': [
			{ 'id': 'playlist', 'name': 'Playlist Name' },
			{ 'id': 'channel', 'name': 'Channel Name' }
		],
		'sortPlaylistsBySelected': (config.sortPlaylistsByName === 'playlist') ? 
			{'id': 'playlist'} : {'id': 'channel'},

		'threshhold': config.threshhold,
		'percentage': Math.floor(config.threshhold) * 100,

		'alwaysOnTop' : config.alwaysOnTop,
		'markPrevious': config.markPrevious,
		'markNext': config.markNext,
		'skipWatched': config.skipWatched,
		'restart': config.restart,

		'afterNonsequentialFinishes': [
			{ 'id': 'next', 'name': 'Play Next' },
			{ 'id': 'random', 'name': 'Play Random Unwatched' },
			{ 'id': 'close', 'name': 'Close Player' }
		],

		'afterNonsequentialFinishesSelected': { 'id': config.afterNonsequentialFinishes },
		'showDesc': config.showDesc
	}

	$scope.dataChanged = (what) => {
		
		switch(what) {
			case 'theme':
				config.theme = $scope.data.themeSelected.id;
				break;

			case 'defaultType':
				config.sequential = ($scope.data.defaultTypeSelected.id === 'sequential') ? true : false;
				break;

			case 'sortPlaylistsBy':
				config.sortPlaylistsByName = $scope.data.sortPlaylistsBySelected.id;
				ipcRenderer.send('sort-playlists');
				break;

			case 'threshhold':
				config.threshhold = $scope.data.threshhold;
				$scope.data.percentage = $scope.data.threshhold * 100;
				break;

			case 'alwaysOnTop':
				config.alwaysOnTop = $scope.data.alwaysOnTop;
				break;

			case 'markPrevious':
				config.markPrevious = $scope.data.markPrevious;
				break;

			case 'markNext':
				config.markNext = $scope.data.markNext;
				break;

			case 'skipWatched':
				config.skipWatched = $scope.data.skipWatched;
				break;

			case 'afterNonsequentialFinishes':
				config.afterNonsequentialFinishes = $scope.data.afterNonsequentialFinishesSelected.id;
				break;

			case 'restart':
				config.restart = $scope.data.restart;
				break;
			case 'showDesc':
				config.showDesc = $scope.data.showDesc;
				break;
		}

		saveConfig();
	}

	function saveConfig() {
		shared.setConfig(config);
		console.log(shared.config());
	}

	holder.ondragover = () => {
	  return false;
	}

	holder.ondragleave = holder.ondragend = () => {
	  return false;
	}

	holder.ondrop = (e) => {
	  e.preventDefault()

	  if(e.dataTransfer.files.length > 1) { alert('Only 1 file is allowed!'); return; }

	  fs.readFile(e.dataTransfer.files[0].path, 'utf-8', (err, data) => {
			$timeout(restoreData(data));
	  });
	}

	$scope.backup = () => {
		dialog.showSaveDialog({title:'Save Backup', buttonLabel:'Save'}, function(path) {
			if(path) {
				saveBackup(path);
			}
			
		}); 
	}

	function saveBackup(path) {

		let info = JSON.stringify({
			'config': shared.config(),
			'playlists': shared.getPlaylists()
		});

		fs.writeFile(path, info, (err) => {
			if(err) { confirm('Something went wrong while saving.' + err.message + '. Press OK to view current issues on GitHub'); }
		});
	}

	function restoreData(data) {
		if(data === '') {
			alert('File is empty. Please try another file.');
			return;
		}
		let restored = JSON.parse(data);
		var msg;
		var restart = false;

		if(restored.config) {
			shared.setConfig(restored.config);
			msg = 'Settings were restored!';
			restart = true;
		} else { msg = 'Settings were not found in file.'; }

		if(restored.playlists) {
			shared.setPlaylists(restored.playlists);
			msg += ' Playlists were restored!';
			restart = true;
		} else { msg += ' Playlists were not found in file.'; }

		msg += (restart) ? ' Press OK to restart ViewTube.' : '';
		alert(msg)
		
		if(restart) {
			ipcRenderer.send('restart-app');
		}

	}

}