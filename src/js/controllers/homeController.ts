require('angular').module('viewTube')
.controller('homeController', homeController);

function homeController($scope, shared, $window) {
	$scope.plists = shared.getPlaylists();

	$scope.displayMsg = true;
	$scope.showDesc = shared.config().showDesc;

	console.log(shared.getPlaylists());

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

	$scope.remove = function(n) {
		if(confirm('Remove playlist ' + shared.getPlaylists()[n].title + '?')) {
			let temp = shared.getPlaylists();
			temp.splice(n, 1);
			shared.setPlaylists(temp);
		};
	}
}