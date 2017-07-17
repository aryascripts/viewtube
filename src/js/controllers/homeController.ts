require('angular').module('viewTube')
.controller('homeController', homeController);

function homeController($scope, shared) {
	
	var msgBox = document.querySelector('.no-playlists');
	console.log(msgBox);

	$scope.plists = shared.getPlaylists();

	var updatePlaylists = () => {
		$scope.plists = shared.getPlaylists();
		if($scope.plists.length > 0) {
			msgBox.classList.add('hidden');
		}

		$scope.$apply();
	}

	shared.registerObserver(updatePlaylists);
}