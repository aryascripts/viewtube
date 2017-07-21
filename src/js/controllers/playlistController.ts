import { api_key } from './../APIAuth';

const { BrowserWindow } = require('electron').remote;
const remote = require('electron').remote;
const {ipcRenderer} = require('electron');

import Main from './../../Main';

const max = 50;

require('angular').module('viewTube')
.controller('playlistController', playlistController);

function playlistController($scope, shared, $routeParams, $timeout) {
	

	//Local variables for playlists management
	//At major changes this object is saved to the database in router.ts
	var playlists = shared.getPlaylists();
	console.log(playlists);
	var thisIndex = $routeParams.id;

	if(playlists[thisIndex].watching > -1) {
		setPartialVideoBg();
	}

	//These variables are LOCAL only. DO NOT update ANYTHING in these.
	//Only used for DISPLAYING information.
	//All updates to be done in actual playlists[thisIndex] object.
	$scope.videos = playlists[thisIndex].videos;
	$scope.plist = playlists[thisIndex];
	$scope.watching = playlists[thisIndex].watching;

	//Populates the page with playlists
	//This fetches all data from YouTube.
	//Flow as follows:
	// 1) Load first 50 videos (max from YouTube)
	// 2) Check if playlist has more than 50
	//		a) load the next page
	//		b) check if there is another page
	//			i) if yes, go to (a)
	// 3) load video-specific info for all videos in playlist
	populate();

	//Sends an event to Main window to create
	//a new window or load the video in current window.
	//that logic is in Main.ts
	function loadVideo(index, time) {
		playlists[thisIndex].watching = index;
		console.log('setting watching to' + index);

		ipcRenderer.send(
			'create-window',
			{
				'id': playlists[thisIndex].videos[index].id,
				'time': time
			}
		);
	}

	//Loads the next video from given index.
	//If there is no next window, video window
	//is asked to be closed.
	function loadNext(from) {
		//check if trying to load next from the LAST video in the playlist
		if(from === playlists[thisIndex].totalVideos) {
			//there is no more videos in this playlist 
			Main.closeVideoWindow();
			return;
		}

		//there is a next video, load it
		else {
			loadVideo(from+1, 0);
		}
	}

	//If the video has been watched more than the threshhold in Settings,
	//Set it as watched, and save it to database.
	function calculateWatchTime(timeCompleted) {
		
		let thresh = shared.config().threshhold;
		console.log('watching#:'+playlists[thisIndex].watching)
		let totalTime = playlists[thisIndex].videos[ playlists[thisIndex].watching ].durationSec;
		let perc =  timeCompleted / totalTime;
		console.log(thresh + ' ' + totalTime);

		//enough of the video was watched
		if(perc > thresh) {
			console.log('playlist was marked as watched');

			let finished = playlists[thisIndex].watching;

			playlists[thisIndex].videos[finished].watched = true;
			playlists[thisIndex].lastVideo = finished;
			
			//reset the partially watched ID since there is none anymore.
			console.log('SETTING WATCHING TO -1');
			playlists[thisIndex].watching = -1;
			playlists[thisIndex].watchingTime = -1;
			$scope.currentBg = '';

			console.log(playlists[thisIndex].videos[finished].title + ' was set as watched');
			console.log(playlists[thisIndex].videos);
		}

		//video was only partially watched
		else {
			let watching = playlists[thisIndex].watching;
			playlists[thisIndex].watchingTime = timeCompleted;
			playlists[thisIndex].videos[watching].setPercentage(perc);

			setPartialVideoBg();
		}

		//save because a playlist was just marked as watched or partially watched.
		update();
		savePlaylists();
	}

	//called from an event when the WATCHING video ends
	//and we need to load the next.
	function loadNonSequential(from) {
		//check if this video is really non sequential
		if(!playlists[thisIndex].sequential) { console.log('you\'re in the wrong method.'); return; }

		console.log('handle non sequential load next video');
		Main.closeVideoWindow();

	}

	//CALLED when the user clicks on a video manually
	$scope.clickEvent = function(index) {

		//set the current video unwatched (because the user clicked on it to watch it)
		playlists[thisIndex].videos[index].watched = false;

		//mark all previous watched if the setting allows it.
		if(playlists[thisIndex].sequential && shared.config().markPrevious) {
			markPreviousWatched(index);
		}

		//mark all next unwatched if the setting allows it
		//dont do it if this is the last video in the playlist.
		if(playlists[thisIndex].sequential && shared.config().markNext && index < playlists[thisIndex].totalVideos) {
			markNextUnwatched(index);
		}

		//save because bunch of things might have changed.
		savePlaylists();

		loadVideo(index, 0);
	}

	//************************************************//
	//	     				 EVENTS    			     //

	//received when the 'watching' video is FULLY watched
	//load the next video based on what type of playlist
	//and the settings user has set.
	ipcRenderer.on('load-next', (event, args) => {
		let watching = playlists[thisIndex].watching;

		//if playlist is sequential
		if(playlists[thisIndex].sequential) {

			//mark the CURRENT video as watched
			playlists[thisIndex].videos[watching].watched = true;

			//loadNext takes the parameter from where to load the next video
			//in this case, this would be the CURRENT, and it loads the NEXT.
			loadNext(watching);

			//Update UI and save playlists because 
			//a video was just marked as watched.
			update();
			savePlaylists();
		}

		//non-sequential playlist
		else {
			loadNonSequential(watching);
		}
		
	});

	//Received when the videoPlayerWindow is closed
	//Need to calculate if the whole video was watched or not.
	ipcRenderer.on('calc-watch-time', (event, obj) => {
		calculateWatchTime(obj.time);
	});


	//************************************************//
	//	     			HELPERS	    			     //
	// takes an index and marks all the previous videos 
	// (excluding n) as watched. 
	// mainly used for sequential playlists 
	function markPreviousWatched(n) {
		for(let i = 0; i < n; i++) {
			playlists[thisIndex].videos[i].watched = true;
		}
		playlists[thisIndex].lastCompleted = n-1;

		console.log('last completed: ' + playlists[thisIndex].videos[n-1].title);
	}

	//marks the next videos in playlist
	//as unwatched (leaves the current n alone)
	function markNextUnwatched(n) {
		for(let i = n+1; i < playlists[thisIndex].totalVideos; i++) {
			playlists[thisIndex].videos[i].watched = false;
		}
	}

	//Update the playlists and videos of THIS controller
	//using the global playlists
	function update() {
		$scope.videos = playlists[thisIndex].videos;
		$scope.plists = playlists[thisIndex];
		$scope.$apply();
	}

	//save the playlists object to the database FROM this controller.
	function savePlaylists() {
		shared.setPlaylists(playlists);
	}

	function setPartialVideoBg() {
		let perc = playlists[thisIndex].videos[ playlists[thisIndex].watching ].percentage;
		$scope.currentBg = 'background: -webkit-linear-gradient(left, #6b6969 0%,#6b6969 '+ perc +'%,#b50505 '+ perc +'%,#b50505 '+perc+'%,#b50505 100%)';
		$scope.watching = playlists[thisIndex].watching;
	}

	//************************************************//
	//	     ALL OF THESE ARE MEANT TO POPULATE      //
	function populate() {
		if(playlists[thisIndex].videos.length < playlists[thisIndex].totalVideos) {
			
			console.log(playlists[thisIndex].id);

			playlists[thisIndex].videos = [];
			getVideos(playlists[thisIndex].id, null)
					.then(videos => {
						$timeout(function() {
							//add these videos
							playlists[thisIndex].addVideos(videos);
							
							//if there's a next page
							let nextPageToken = (videos['nextPageToken'] !== undefined) ? videos['nextPageToken'] : null;
							if(nextPageToken) {
								console.log('getting next page...')
								nextPage(nextPageToken)
									.then(() => {});
							} 

							//there is no other pages
							else {
								console.log('getting more info for the 50.');
								getMoreInfo();
							}
						}); //timeout
				}); //then
		} //if

	} //fn

	//Goes to the Google server (with HttpRequest) and retreives the videos inside a playlist id
	function getVideos(id:string, page:string) {
		let location = 'https://www.googleapis.com/youtube/v3/playlistItems';
		let headers = {
			'playlistId': id,
			'part':'snippet,contentDetails',
			'key': api_key,
			'maxResults': max
		};

		//if a page was passed in, add that to the header object.
		if(page !== null) {
			headers['pageToken'] = page;
		}
		
		//this returns a promise
		return shared.request().getResponse(location, headers)
			.then(data => {
				console.log(data);
				return data;
			})
			.catch(error => {
				console.log(error);
			});
	}

	//called with the ID of the PLAYLIST (this playlist)
	//This method loops until there are no more pages left.
	function nextPage(page) {
		return getVideos(playlists[thisIndex].id, page)
			.then(moreVideos => {
				playlists[thisIndex].addVideos(moreVideos);
				
				if(moreVideos['nextPageToken'] !== undefined) {
					nextPage(moreVideos['nextPageToken']);
				}
				else {
					console.log('getting more info from the next page')
					console.log(playlists[thisIndex].videos.length);
					getMoreInfo();
				}
			});
	}

	//Gets video-specific information for
	//all videos in the playlist currently
	//ONLY called when the playlist.videos length == playlists.totalVideos
	function getMoreInfo() {
		let info = [];
		let url = 'https://www.googleapis.com/youtube/v3/videos';

		for(let i = 0; i < playlists[thisIndex].videos.length ; i++) {
			let headers = {
				'id': playlists[thisIndex].videos[i].id,
				'key':api_key,
				'part':'contentDetails,snippet'
			};

			shared.request().getResponse(url, headers)
			.then(data => {
				playlists[thisIndex].videos[i].setData(data);

				update();
			}); //shared.request()	
		} //for
	} //fn
	 //				POPULATE ENDS 				//
	//*****************************************//
}