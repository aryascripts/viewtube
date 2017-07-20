import { api_key } from './../APIAuth';

const { BrowserWindow } = require('electron').remote;
const remote = require('electron').remote;
const {ipcRenderer} = require('electron');

import Main from './../../Main';

const max = 50;

require('angular').module('viewTube')
.controller('playlistController', playlistController);

function playlistController($scope, shared, $routeParams, $timeout) {

	var playlists = shared.getPlaylists();
	var thisIndex = $routeParams.id;
	$scope.plist = playlists[thisIndex];
	console.log($scope.plist);
	$scope.videos = $scope.plist.videos;
	$scope.watchCount = $scope.plist.lastVideo;
	$scope.currentVideo = $scope.plist.currentVideo;
	$scope.sequential = playlists[thisIndex].sequential;

	console.log($scope.sequential);

	var watching = 0;

	$scope.currentBg = ($scope.videos[$scope.currentVideo]) ? 'background: -webkit-linear-gradient(left, #6b6969 0%,#6b6969 '+ $scope.videos[$scope.currentVideo].percentage +'%,#b50505 '+ $scope.videos[$scope.currentVideo].percentage +'%,#b50505 '+$scope.videos[$scope.currentVideo].percentage+'%,#b50505 100%)' : '';

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
								.then(() => {});
						} else {
							getMoreInfo();
						}
					});
			});
	}

	function nextPage(id, page) {
		return getVideos(id, page)
			.then(moreVideos => {
				$timeout(function() {
					$scope.plist.addVideos(moreVideos);
					$scope.videos = $scope.plist.videos;
				});
				
				if(moreVideos['nextPageToken'] !== undefined) {
					nextPage($scope.plist.id, moreVideos['nextPageToken']);
				} else {
					getMoreInfo();
				}

			});
	}

	function getMoreInfo() {
		let info = [];
		let url = 'https://www.googleapis.com/youtube/v3/videos';

		for(let i = 0; i < $scope.videos.length; i++) {

			let headers = {
				'id': $scope.videos[i].getId(),
				'key':api_key,
				'part':'contentDetails,snippet'
			};
			shared.request().getResponse(url, headers)
			.then(data => {
				$scope.videos[i].setData(data);
				$scope.plist.videos[i] = $scope.videos[i];

				if(playlists[thisIndex].sequential && playlists[thisIndex].currentVideo === i) {
					setCurrentVideo();
				}
				
				if(playlists[thisIndex].watched !== null) {
					for(let i = 0; i < playlists[thisIndex].watched.length; i++) {
						playlists[thisIndex].videos[playlists[thisIndex].watched[i]].watched = true;
					}
				}
				
				$scope.$apply();
			});	
		}
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

	function setCurrentVideo() {

		if(playlists[thisIndex].currentVideo < 0 || !playlists[thisIndex].sequential) {
			return;
		}
		console.log('setting current video');
		//this is the current video, set styles
		$scope.currentVideo = playlists[thisIndex].currentVideo;
		let watchTime = playlists[thisIndex].currentVideoWatchTime;
		let totalTime = playlists[thisIndex].videos[$scope.currentVideo].getDurationSec();

		console.log(totalTime);

		let percentage = watchTime / totalTime;
		console.log(percentage)

		playlists[thisIndex].videos[$scope.currentVideo].setPercentage(percentage);
		
		let perc = playlists[thisIndex].videos[$scope.currentVideo].percentage;
		
		$scope.currentBg = 'background: -webkit-linear-gradient(left, #6b6969 0%,#6b6969 '+ perc +'%,#b50505 '+ perc +'%,#b50505 '+perc+'%,#b50505 100%)';
		
	}

	$scope.loadVideo = function(n, time) {
		$timeout(function() {
			
			if(playlists[thisIndex].sequential) {
				playlists[thisIndex].setLastVideo(n - 1);
				$scope.watchCount = n - 1;

				for(let i = 0; i < n; i++) {
					playlists[thisIndex].videos[i].watched = true;
					if(!playlists[thisIndex].watched.includes(i)) {
						playlists[thisIndex].watched.push(i);
					}
				}

			}

			//only used for nonsequential playlists
			watching = n;
			
			shared.setPlaylists(playlists);

			ipcRenderer.send('create-window', {
				'id': $scope.videos[n].getId(),
				'time': time
				});
		});
	}

	//function to load the next video (if there is no current)
	//or close the window if all videos watched.
	$scope.loadNext = function(isEvent) {

		if(!playlists[thisIndex].sequential) {
			console.log('play random video from unwatched');
			return;
		}

		//there is no current video, load the next one that isn't watched
		if(playlists[thisIndex].currentVideo < 0) {
			//check if there is a next video in the playlist
			if(($scope.watchCount + 2) <= playlists[thisIndex].totalVideos) {
				//Watch count is the video before CURRENT. Next video is 2 videos AFTER watch count. loadVideo() then sets the watchCount at current video after the next loads
				let num = isEvent ? $scope.watchCount + 2 : $scope.watchCount + 1;
				$scope.loadVideo(num, 0);
			} 
			//there is no next video. close the window
			else {
				playlists[thisIndex].watchCount($scope.watchCount++);
				Main.closeVideoWindow();
			}
		}

		//there is a current unfinished video, load that instead.
		else {
			let currentVideo = playlists[thisIndex].currentVideo;
			let currentVideoWatchTime = playlists[thisIndex].currentVideoWatchTime;

			$scope.loadVideo(currentVideo, currentVideoWatchTime);

			//remove the video as a current video
			//If user decides to quit this video in the middle, it will then be set again as current video.
			playlists[thisIndex].videos[$scope.watchCount + 1].removeIsCurrent();
			playlists[thisIndex].currentVideo = -1;
			playlists[thisIndex].currentVideoWatchTime = 0;
		}

		shared.setPlaylists(playlists);
	}

	function checkEnoughWatched(time) {

		if(playlists[thisIndex].sequential) {
			//current video is the last wathced video + 1
			var current = $scope.watchCount + 1;
		} else {
			current = watching;
		}

		console.log('CHECKING ENOUGH WATCHED: ' + current);

		//total and watch times for calculation
		let watchTime = time.time;
		let totalTime = $scope.plist.videos[current].getDurationSec();
		let percentage = watchTime / totalTime;

		console.log('PERCENTAGE: ' + percentage);
		console.log('THRESHHOLD: ' + shared.config().watchTimeThresh);
		// mark video as watched since it is watched more than the threshhold.
		// currently watching is set to null because the video was now fully watched.
		if(percentage > shared.config().watchTimeThresh) {
			console.log('CURRENT VIDEO SET AS WATCHED');

			console.log('watch Count: ' + $scope.watchCount);

			//playlist is sequential
			if(playlists[thisIndex].sequential) {
				playlists[thisIndex].lastVideo = ++$scope.watchCount;
				playlists[thisIndex].currentVideoWatchTime = 0;
				playlists[thisIndex].currentVideo = -1;
				$scope.currentVideo = -1;
			} 
			
			playlists[thisIndex].videos[current].watched = true;
			playlists[thisIndex].watched.push(current);
		}

		//else, video was not fully watched.
		else {
			console.log('CURRENT VIDEO: ' + current);
			playlists[thisIndex].currentVideo = current;
			playlists[thisIndex].currentVideoWatchTime = watchTime;

			playlists[thisIndex].videos[current].setPercentage(percentage);
			setCurrentVideo();
		}
		//either way, save to database.
		$timeout(() => {
			shared.setPlaylists(playlists);
		});
	}

	var applyData = function() {
		$scope.$apply();
	}

	shared.registerObserver(applyData);
	//last video was fully watched, load the next one
	//event originally sent from video-window, to App.ts, to this. 
	ipcRenderer.on('load-next', (event, args) => {
		if(playlists[thisIndex].sequential) {
			$scope.loadNext(true);
		} else {
			ipcRenderer.send('close-video', true);
		}
		
	});

	ipcRenderer.on('calc-watch-time', (event, time) => {
		checkEnoughWatched(time);
	});
}