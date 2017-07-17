require('angular').module('viewTube')
.controller('homeController', homeController);

function homeController($scope, shared) {
	$scope.plists = shared.getPlaylists();

	$scope.displayMsg = true;

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
}