require('angular').module('viewTube')
.controller('playlistController', playlistController);

function playlistController($scope, shared, $routeParams) {
	$scope.message = $routeParams.id;
}