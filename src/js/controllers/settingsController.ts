require('angular').module('viewTube')
.controller('settingsController', settingsController);

function settingsController($scope, shared) {
	$scope.message = 'I am the settings page';
}