require('angular').module('viewTube')
.controller('homeController', homeController);

function homeController($scope, shared) {
	$scope.message = 'I am on the home page';
}