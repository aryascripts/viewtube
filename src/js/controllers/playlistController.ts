import { api_key } from './../APIAuth';
var max = 50;

require('angular').module('viewTube')
.controller('playlistController', playlistController);

function playlistController($scope, shared, $routeParams) {
	var playlists = shared.getPlaylists();
	$scope.plist = playlists[$routeParams.id];
	$scope.videos = $scope.plist.getVideos();

	var nextPageToken = null;

	if($scope.plist.videos.length < $scope.plist.totalVideos) {
		getVideos($scope.plist.id, null)
				.then(videos => {
					nextPageToken = (videos['nextPageToken'] !== undefined) ? videos['nextPageToken'] : null;
					$scope.plist.addVideos(videos);
					$scope.videos = $scope.plist.videos;

					if(nextPageToken) {
						console.log('getting next page...')
						nextPage($scope.plist.id, nextPageToken)
							.then(() => {

							});
					}

					$scope.$apply();
			});
	}
	function nextPage(id, page) {
		return getVideos(id, page)
			.then(moreVideos => {
				$scope.plist.addVideos(moreVideos);
				$scope.$apply();

				if(moreVideos['nextPageToken'] !== undefined) {
					nextPage($scope.plist.id, moreVideos['nextPageToken']);
				}

			});
	}


	//Goes to the Google server (with HttpRequest) and retreives the videos inside a playlist id
	function getVideos(id:string, page:string) {
		let location = 'https://www.googleapis.com/youtube/v3/playlistItems';
		let headers = {
			'playlistId': id,
			'part':'snippet',
			'key': api_key,
			'maxResults': max
		}

		if(page !== null) {
			headers['pageToken'] = page;
		}
		
		return shared.request().getResponse(location, headers)
			.then(data => {
				return data;
			})
			.catch(error => {
				console.log(error);
			});
	}
}

