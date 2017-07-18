import { api_key } from './../APIAuth';

const { BrowserWindow } = require('electron').remote;
const remote = require('electron').remote;
const {ipcRenderer} = require('electron');

import Main from './../../Main';

var max = 50;

var videoWindow = null;;

require('angular').module('viewTube')
.controller('playlistController', playlistController);

function playlistController($scope, shared, $routeParams, $timeout) {

	var playlists = shared.getPlaylists();
	var thisIndex = $routeParams.id;
	$scope.plist = playlists[thisIndex];
	$scope.videos = $scope.plist.getVideos();

	$scope.watchCount = $scope.plist.lastVideo;
	console.log($scope.watchCount);

	var nextPageToken = null;

	if($scope.plist.videos.length < $scope.plist.totalVideos) {
		console.log('running get videos ...');
		getVideos($scope.plist.id, null)
				.then(videos => {

					$timeout(function() {
						nextPageToken = (videos['nextPageToken'] !== undefined) ? videos['nextPageToken'] : null;
						$scope.plist.addVideos(videos);
						$scope.videos = $scope.plist.videos;

						if(nextPageToken) {
							console.log('getting next page...')
							nextPage($scope.plist.id, nextPageToken)
								.then(() => {

								});
						}
					});
			});
	}
	function nextPage(id, page) {
		return getVideos(id, page)
			.then(moreVideos => {
				$timeout(function() {
					$scope.plist.addVideos(moreVideos);
					// $scope.$apply();
				});
				
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
			'part':'snippet,contentDetails',
			'key': api_key,
			'maxResults': max
		};

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

	$scope.loadVideo = function(n) {
		console.log('setting watch count to ' + n);
		$timeout(function() {
			playlists[thisIndex].setWatchCount(n);
			$scope.watchCount = n;
			shared.setPlaylists(playlists);
			shared.storage().savePlaylists(playlists);


			console.log('sending event...');
			ipcRenderer.send('create-window', $scope.videos[n].getId());
		});
	}

	$scope.loadNext = function() {
		if($scope.watchCount < playlists[thisIndex].totalVideos) {
			$scope.loadVideo(++$scope.watchCount);
		} else {
			Main.closeVideoWindow();
		}
	}

	function checkEnoughWatched(time) {
		
	}

	ipcRenderer.on('load-next', (event, args) => {
		$scope.loadNext();
	});

}


