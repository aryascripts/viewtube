import { Playlist } from './../Playlist';
import { api_key } from './../helpers/auth';
import {ipcRenderer} from 'electron';
const fs = require('fs');

require('angular').module('viewTube')
.controller('uiController', uiController);

function uiController($scope, shared, $rootScope) {

	var checkButton = document.getElementById('btn-check');
	var urlTextBox = <HTMLInputElement>document.getElementById('url-text');


	$scope.clearSearch = function() {
		$scope.searchBox = '';
	}
	
	document.addEventListener('drop', function(e) {
	  e.preventDefault();
	  e.stopPropagation();
	});
	document.addEventListener('dragover', function(e) {
	  e.preventDefault();
	  e.stopPropagation();
	});

	require('dns').resolve('www.google.com', function(err) {
		if(err) {
			alert('There was no internet connection found.');
			ipcRenderer.send('close-app');
		}

		else {
			loadPlaylists();
		}
	});

	//shows and hides the add button
	//first you toggle the add form, then if the check button is pressed,
	//add a new tab with provided URL and place the repository name.
	shared.btnAdd().addEventListener('click', () => {
		toggleAddForm();
		urlTextBox.focus();

		urlTextBox.addEventListener('keyup', function(event) {
		    event.preventDefault();
		    if (event.keyCode == 13) {
		        addFromForm();
		    }
		});

	});

	checkButton.addEventListener('click', addFromForm);

	function addFromForm() {
		let url:string = urlTextBox.value;
		if(!url) { return; }
		if(url.startsWith(shared.prefix())) {
			//when adding a new playlist from the form,
			//no need to set any parameters for current/last video.
			let watched = [];
			addPlaylist(url.split('=')[1], -1, '', -1, shared.config().sequential)
				.then(count => {
					sortPlaylists();
				})
				.catch(error => {
					alert('hi');
				});
			toggleAddForm();
		}
		//Not a valid url for playlist
		else {
			console.log(shared.prefix());
			alert('Please check URL matches format.\nExample: ' + shared.prefix() + '...');
		}

		(<HTMLFormElement>document.getElementById('addVideoForm')).reset();
	}

	//Creates a new Playlist object based on the url in the form.
	//Pushes object to the array of all playlists currently tracking
	//Called on checkmark button press
	function addPlaylist(id, last, watchingId, watchingTime, seq, 
		//optional parameters
		watchedArr = [], partialArr = []) {

		return new Promise((resolve, reject) => {
			getPlaylistInfo(id)
				.then(info => {
					let plist = new Playlist(info);
					plist.sequential = seq;
					plist.lastCompleted = last;
					plist.watchingId = watchingId;
					plist.watchingTime = watchingTime;
					plist.watched = watchedArr;
					plist.partial = partialArr

					let temp = shared.getPlaylists();
					temp.push(plist);


					shared.setPlaylists(temp)
						//setPlaylists returns a boolean if saved
						.then(saved => {
							if(saved){ resolve(temp.length); }
						})
						.catch(error => {
							reject(confirm('We had an error saving your data. ' + error));
						});
			})
				.catch(error => {
					//Restart the program
					alert('There was a problem adding your playlist. Please check the URL.');
				});
		});
	}

	//Goes to the Google server (with HttpRequest) and retreives the playlist information
	function getPlaylistInfo(id:string) {
		let info;
		let location = 'https://www.googleapis.com/youtube/v3/playlists';
		let headers = {
			'id': id,
			'part':'snippet,contentDetails',
			'key': api_key,
		}

		return shared.request().getResponse(location, headers)
			.then(data => {
				return data;
			})
			.catch(error => {
				confirm('Click OK to view current issues on GitHub. Error: ' + error);
			});
	}

	//Method for displaying and removing the
	//Add New form
	function toggleAddForm() {
		let btnSpan:HTMLElement = document.getElementById('btn-url-span');
		btnSpan.classList.toggle('icon-plus-circled');
		btnSpan.classList.toggle('icon-minus-circled');

		shared.urlCont().classList.toggle('hidden');
	}

	//this method is for loading ALL playlists from the storage file.
	//can also be used in the future for loading playlists from a backup.
	function loadPlaylists() {

		//if nothing was passed in here, load from the storage
		//if there is nothing in storage, a new storage file is created next time.
		shared.storage().get('playlists')
				.then(data => {
					let sorted = false;
					if(data['playlists']) {
						for(let i = 0; i < data['playlists'].length; i++) {

							//adding playlists fro the storage
							//sets all parameters in the currently adding playlist.
							//go see addPlaylist() definition above.
							addPlaylist(
								data['playlists'][i].id,
								data['playlists'][i].lastCompleted,
								data['playlists'][i].watchingId,
								data['playlists'][i].watchingTime,
								data['playlists'][i].sequential,
								data['playlists'][i].watched,
								data['playlists'][i].partial)
							.then(count => {
								sortPlaylists();
							})
						}
					}
					//Send the event to load the page now (everything loaded)
					ipcRenderer.send('config-loaded');
				})
				.catch(error => {
					confirm('Click OK to view current issues on GitHub. Error: ' + error);
				});
		}

	function sortPlaylists() {
		let temp = shared.getPlaylists();
		temp.sort(comparePlaylists);
		for(let i = 0; i < temp.length; i++) {
			temp[i].index = i;
		}
		shared.setPlaylists(temp);
	}

	function comparePlaylists(a, b) {
		var a = (shared.config().sortPlaylistsByName === 'channel') ? a.channelName.toUpperCase() : a.title.toUpperCase();
		var b = (shared.config().sortPlaylistsByName === 'channel ') ? b.channelName.toUpperCase() : b.title.toUpperCase();

		if(a < b) { return -1; }
		if(a > b) { return  1; }
		
		return 0;
	}

	ipcRenderer.on('sort-playlists', (event, obj) => {
		sortPlaylists();
	});

	$rootScope.$on("$routeChangeSuccess", () => {
		$scope.clearSearch();
	});

}