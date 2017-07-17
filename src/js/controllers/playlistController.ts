import { api_key } from './../APIAuth';
const { BrowserWindow } = require('electron').remote;

var max = 50;

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
			'part':'snippet',
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
		});
		createVideoWindow($scope.videos[n].getId());
	}

	function createVideoWindow(videoId) {
		console.log('video id: ' + videoId);
		var vidWin = new BrowserWindow({
			show: false,
		    width: 750,
		    height: 530,
		    'minWidth': 600,
		    'minHeight': 350,
		    'acceptFirstMouse': true,
		    'titleBarStyle': 'hidden'
		});
		vidWin.once('ready-to-show', () => {
            vidWin.show();
        });
		vidWin.on('closed', () => {
			vidWin = null;
		});
		vidWin.loadURL('file://' + __dirname + '/../../components/video.html?id=' + videoId);
	}
}

