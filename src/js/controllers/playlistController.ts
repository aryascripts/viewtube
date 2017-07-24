import { api_key } from './../APIAuth';

const { BrowserWindow } = require('electron').remote;
const remote = require('electron').remote;
const {ipcRenderer} = require('electron');
const {shell} = require('electron')

const max = 50;

require('angular').module('viewTube')
.controller('playlistController', playlistController);

function playlistController($scope, shared, $routeParams, $timeout) {

	//Local variables for playlists management
	//At major changes this object is saved to the database in router.ts
	var playlists = shared.getPlaylists();
	console.log(playlists);
	var thisIndex = $routeParams.id;

	//These variables are LOCAL only. DO NOT update ANYTHING in these.
	//Only used for DISPLAYING information.
	//All updates to be done in actual playlists[thisIndex] object.
	$scope.data = {
		'type': [
			{ id:'sequential', name:'Sequential'},
			{ id:'nonsequential', name: 'Non-sequential' }
		],
		'typeSelected': (playlists[thisIndex].sequential) ?
			{'id': 'sequential'} : {'id': 'nonsequential'},
		'watching': playlists[thisIndex].watching,
		'plist': playlists[thisIndex],
		'videos': playlists[thisIndex].videos,
		'buttonText': buttonText()
	}

	console.log($scope.data);

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
	function loadVideo(index) {

		playlists[thisIndex].watching = index;
		playlists[thisIndex].videos[index].setWatching(true);
		playlists[thisIndex].watchingId = playlists[thisIndex].videos[index].id;

		//Check if config wants to restart the video
		let time = shared.config().restart ? 0 : playlists[thisIndex].videos[index].watchingTime;

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
		if(from === playlists[thisIndex].totalVideos - 1) {
			//there are no more videos in this playlist 
			ipcRenderer.send('close-video');
		}

		//there is a next video, load it
		//check if you want to skip watched videos
		else {
			let n = from+1;
			if(playlists[thisIndex].sequential && shared.config().skipWatched) {
				for(let i = n; i < playlists[thisIndex].totalVideos; i++) {
					if(!playlists[thisIndex].videos[i].watched) {
						n = i;
						break;
					}
				}
			}

			loadVideo(n);
		}
	}

	//called from an event when the WATCHING video ends
	//and we need to load the next.
	function loadNonSequential(from) {

		//check if this video is really non sequential
		if(playlists[thisIndex].sequential) { 
			if(confirm('Something went wrong. Error#: 151. It is recommended you restart ViewTube. Press OK to view or create an issue in GitHub.')) {
				shell.openExternal('https://github.com/amanb014/viewtube/issues');
			}
		}



		switch(shared.config().afterNonsequentialFinishes) {
			case 'next':
				loadNext(from);
				break;
			
			case 'close':
				ipcRenderer.send('close-video');
				break;

			default:
				loadRandomVideo();
				break;
		}
	}

	function loadRandomVideo() {
		//all videos were watched, just load any video.
		if(playlists[thisIndex].watched.length === playlists[thisIndex].totalVideos) {
			loadVideo(Math.floor(Math.random() * (playlists[thisIndex].videos.length-1)));
		}

		//else, look for a video that is unwatched
		else {
			let found = false;
			while(!found) {
				let rand = Math.floor(Math.random() * (playlists[thisIndex].videos.length-1));
				if(!playlists[thisIndex].videos[rand].watched) {
					found = true;
					loadVideo(rand);
				}
			}
		}
	}

	//If the video has been watched more than the threshhold in Settings,
	//Set it as watched, and save it to database.
	function calculateWatchTime(timeCompleted, vidId) {

		console.log('CALCULATE ENOUGH WATCHED TIME');

		if(playlists[thisIndex].watching < 0) return;
		if(playlists[thisIndex].videos[ playlists[thisIndex].watching ].id !== vidId) {
			return;
		}
		
		let thresh = shared.config().threshhold;
		console.log('watching#:'+playlists[thisIndex].watching)
		let totalTime = playlists[thisIndex].videos[ playlists[thisIndex].watching ].durationSec;
		let perc =  timeCompleted / totalTime;
		console.log(thresh + ' ' + perc);

		//enough of the video was watched
		if(perc > thresh) {
			
			let finished = playlists[thisIndex].watching;
			console.log('video was marked as watched: ' + finished );

			playlists[thisIndex].videos[finished].setWatched(true);
			pushToWatched(playlists[thisIndex].videos[finished].id);
			playlists[thisIndex].lastCompleted = finished;
			
			//reset the partially watched ID since there is none anymore.
			console.log('SETTING WATCHING TO -1');
			playlists[thisIndex].watching = -1;
			playlists[thisIndex].watchingTime = -1;
			playlists[thisIndex].watchingId = '';

			console.log(playlists[thisIndex].videos[finished].title + ' was set as watched');
		}

		//video was only partially watched
		else {
			console.log('video was marked partially watched');
			pushToPartiallyWatched(playlists[thisIndex].watching, timeCompleted);
		}

		//save because a playlist was just marked as watched or partially watched.
		update();
		savePlaylists();
	}

	function pushToPartiallyWatched(index, time) {
			playlists[thisIndex].watchingTime = time;
			playlists[thisIndex].videos[index].setPercentage(time);
			playlists[thisIndex].videos[index].setWatching(true);
			let found = false;

			//If the video is already in 'partial', then update the time.
			for(let i = 0; i < playlists[thisIndex].partial.length; i++) {
				//Check if this video already exists as a partially watching
				if(playlists[thisIndex].videos[index].id === playlists[thisIndex].partial[i].id) {
					playlists[thisIndex].partial[i].time = Math.floor(time);
					found = true;
					break;
				}
			}

			//If the video was not found in 'partial', then push it.
			if(!found) {
				playlists[thisIndex].partial.push({
					'id': playlists[thisIndex].videos[index].id,
					'time': Math.floor(time)
				});
			}
			
	}
	//CALLED when the user clicks on a video manually
	$scope.clickEvent = function(index) {
		
		//If config allows, restart the clicked video.
		//If not, load the time left at (if not started, this was initialized to 0)

		//set the current video unwatched (because the user clicked on it to watch it)
		playlists[thisIndex].videos[index].setWatched(false);
		
		//remove the id from the array 'watched' if it exists
		for(let i = 0; i < playlists[thisIndex].watched.length; i++) {
			if(playlists[thisIndex].watched[i] === playlists[thisIndex].videos[index].id) {
				playlists[thisIndex].watched.splice(i,1);
			}
		}

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
		savePlaylists()
		loadVideo(index);
	}

	//************************************************//
	//	     				 EVENTS    			     //
	//received when the 'watching' video is FULLY watched
	//load the next video based on what type of playlist
	//and the settings user has set.
	ipcRenderer.on('load-next', (event, args) => {
		let watching = playlists[thisIndex].watching;

		//mark the CURRENT video as watched & push the ID
		playlists[thisIndex].videos[watching].setWatched(true);
		pushToWatched(playlists[thisIndex].videos[watching].id);

		//if playlist is sequential
		if(playlists[thisIndex].sequential) {
			//loadNext takes the parameter from where to load the next video
			//in this case, this would be the CURRENT, and it loads the NEXT.
			loadNext(watching);
		}

		//non-sequential playlist
		else {
			loadNonSequential(watching);
		}

		savePlaylists();
		update();
	});

	//Received when the videoPlayerWindow is closed
	//Need to calculate if the whole video was watched or not.
	ipcRenderer.on('calc-watch-time', (event, obj) => {
		console.log('received watch time event');
		calculateWatchTime(obj.time, obj.id);
	});

	//Playlist type was changed
	$scope.typeChanged = () => {
		playlists[thisIndex].sequential = 
				($scope.data['typeSelected']['id'] === 'sequential') ? true : false;
		savePlaylists();
		$scope.data.buttonText = buttonText();
	}

	//Green button was pressed
	//Based on the playlist type and state of playlist,
	//It does different things
	$scope.greenButton = () => {

		//If there is an unfinished video, load that.
		if(playlists[thisIndex].watching > -1) {
			loadVideo(playlists[thisIndex].watching);
			return;
		}

		//Sequential playlist
		if(playlists[thisIndex].sequential) {

			//If no videos have been watched so far
			if($scope.data.buttonText === 'Start Watching') {
				loadVideo(0);
			}

			//If they have, load the one right after the last one that was completed
			else {
				//load next if the last completed was NOT the last video in playlist
				if(playlists[thisIndex].lastCompleted !== playlists[thisIndex].videos.length - 1) {
					loadNext(playlists[thisIndex].lastCompleted);
				}

				//if all videos have not been watched, load the first unwatched video you can find.
				else if(playlists[thisIndex].totalVideos !== playlists[thisIndex].watched.length){
					for(let i = 0; i < playlists[thisIndex].videos.length; i++) {
						if(!playlists[thisIndex].videos[i].watched) {
							loadVideo(i);
						}
					}
				}

				//If nothing works, just load the first video
				else {
					loadVideo(0);
				}
			}
		}

		//Non sequential playlist
		else {
			loadRandomVideo();
		}
	}

	//************************************************//
	//	     			HELPERS	    			     //
	// takes an index and marks all the previous videos 
	// (excluding n) as watched. 
	// mainly used for sequential playlists 
	function markPreviousWatched(n) {
		for(let i = 0; i < n; i++) {
			playlists[thisIndex].videos[i].setWatched(true);
			pushToWatched(playlists[thisIndex].videos[i].id);
		}
		playlists[thisIndex].lastCompleted = n-1;

		console.log('last completed: ' + playlists[thisIndex].videos[n-1].title);
	}

	//marks the next videos in playlist
	//as unwatched (leaves the current n alone)
	function markNextUnwatched(n) {
		for(let i = n+1; i < playlists[thisIndex].totalVideos; i++) {
			playlists[thisIndex].videos[i].setWatched(false);
			for(let j = 0; j < playlists[thisIndex].watched.length; j++) {
				if(playlists[thisIndex].videos[i].id === playlists[thisIndex].watched[j]) {
					playlists[thisIndex].watched.splice(j,1);
				}
			}
		}
	}

	//Update the playlists and videos of THIS controller
	//using the global playlists
	function update() {
		$scope.data.videos = playlists[thisIndex].videos;
		$scope.data.plist = playlists[thisIndex];
		$scope.$apply();
	}

	//Register update function as an observer
	shared.registerObserver(update);

	//save the playlists object to the database FROM this controller.
	function savePlaylists() {
		shared.setPlaylists(playlists);
	}

	function pushToWatched(id) {
		if(!playlists[thisIndex].watched.includes(id)) {
			playlists[thisIndex].watched.push(id);
		}

	}

	function buttonText() {
		console.log(playlists[thisIndex].watching);
			if(playlists[thisIndex].watchingTime > -1) {
				return 'Resume Watching';
			}

			if(playlists[thisIndex].sequential) {
				if(playlists[thisIndex].watched.length === playlists[thisIndex].totalVideos){
					return 'Restart Playlist'
				} 
				else if(playlists[thisIndex].lastCompleted < 0) {
					return 'Start Watching';
				}
				else { return 'Resume Watching'; }
			}
			else {
				return 'Random Video';
			}
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
	//Gets 50 videos (max) at a time and returns the data
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


			//set the playlists[thisIndex].watching index (NUMBER)
			if(playlists[thisIndex].videos[i].id === playlists[thisIndex].watchingId) {
				playlists[thisIndex].watching = i;
			}

			shared.request().getResponse(url, headers)
			.then(data => {
				playlists[thisIndex].videos[i].setData(data, playlists[thisIndex].watched, playlists[thisIndex].partial);

				update();
			}); //shared.request()	
		} //for
		console.log(playlists[thisIndex]);
	} //fn
	 //				POPULATE ENDS 				//
	//*****************************************//
}