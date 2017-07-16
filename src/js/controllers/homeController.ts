require('angular').module('viewTube')
.controller('homeController', homeController);

function homeController($scope, shared) {
	$scope.message = 'I am on the home page';
	$scope.plists = shared.getPlaylists();



	var updatePlaylists = () => {
		$scope.plists = shared.getPlaylists();
		$scope.$apply();
		console.log($scope.plists);
	}

	shared.registerObserver(updatePlaylists);
}