/****************************************************************
File: homeController.js
Purpose: The controller for the first page which is the "home". 
The home is the one that displays all the playlists that are in the system.
Author: Aman Bhimani
*****************************************************************/

import {shell} from 'electron';
require('angular').module('viewTube')
.controller('homeController', homeController);

function homeController($scope, shared, $window) {
	
	//Set scope variables for AngularJS
	$scope.plists = shared.getPlaylists();
	$scope.displayMsg = true;
	$scope.showDesc = shared.config().showDesc;

	console.log(shared.getPlaylists());

	//Updates the playlists from the main service and updates the Angular view
	var updatePlaylists = () => {
		$scope.plists = shared.getPlaylists();
		if($scope.plists !== undefined && $scope.plists.length > 0) {
			$scope.displayMsg = false;
			shared.noPlaylists = false;
		} else {
			$scope.displayMsg = true;
			shared.noPlaylists = true;
		}

		$scope.$apply();
	}

	shared.registerObserver(updatePlaylists);

	//Removes the playlist from the home page and the object/storage as well
	$scope.remove = function(n) {
		if(confirm('Remove playlist ' + shared.getPlaylists()[n].title + '?')) {
			let temp = shared.getPlaylists();
			temp.splice(n, 1);
			shared.setPlaylists(temp);
		};
	}

	//Opens the Video in a new window (sends to the main node process)
	$scope.goToYouTube = (id) => {
		shell.openExternal('https://www.youtube.com/playlist?list='+id);
	}
}
