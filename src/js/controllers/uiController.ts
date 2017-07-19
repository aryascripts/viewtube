import { Playlist } from './../Playlist';
import { api_key } from './../APIAuth';

require('angular').module('viewTube')
.controller('uiController', uiController);

function uiController($scope, shared) {

	loadConfig();
	loadPlaylists();

	//shows and hides the add button
	//first you toggle the add form, then if the check button is pressed,
	//add a new tab with provided URL and place the repository name.
	shared.btnAdd().addEventListener('click', () => {

		toggleAddForm();
		let checkButton:HTMLElement = document.getElementById('btn-check');

		if(shared.urlInput().innerHTML.trim() !== '') {
			checkButton.addEventListener('click', () => {
				let url:string = (<HTMLInputElement>document.getElementById('url-text')).value;
				if(url.startsWith(shared.prefix())) {
					//when adding a new playlist from the form,
					//no need to set any parameters for current/last video.
					addPlaylist(url.split('=')[1], -1, -1, -1);
				}
				//Not a valid url for playlist
				else {
					console.log('Please enter a valid playlist URL. For example: ' + shared.prefix() + '...');
				}
				toggleAddForm();
			});
		}
	});

	//Creates a new Playlist object based on the url in the form.
	//Pushes object to the array of all playlists currently tracking
	//Called on checkmark button press
	function addPlaylist(id, lastVideo, current, currentTime) {

		//used to add playlist from ANYWHERE.
		getPlaylistInfo(id).then(info => {
			let plist = new Playlist(info);
			plist.setLastVideo(lastVideo);
			plist.currentVideo = current;
			plist.currentVideoWatchTime = currentTime;

			let temp = shared.getPlaylists();
			temp.push(plist);

			shared.setPlaylists(temp);
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
				console.log(error);
			});
	}

	//Method for displaying and removing the
	//Add New form
	function toggleAddForm() {
		let btnSpan:HTMLElement = document.getElementById('btn-url-span');
		btnSpan.classList.toggle('icon-plus-circled');
		btnSpan.classList.toggle('icon-minus-circled');

		let formElements:string = '<input id="url-text" style="width: 50%;" class="text-input" type="text" placeholder=" https://www.youtube.com/playlist?list=..."><button id="btn-check" ng-click="update()" class="btn btn-default"><span class="icon icon-check"></span></button>';
		shared.urlInput().innerHTML = shared.urlInput().innerHTML.trim() == '' ? formElements : '';
	}

	function toggleBackButton() {
		let backButton:HTMLElement = document.getElementById('btn-back');
		backButton.classList.toggle('hidden');
	}

	//this method is for loading ALL playlists from the storage file.
	//can also be used in the future for loading playlists from a backup.
	function loadPlaylists(obj) {

		//if nothing was passed in here, load from the storage
		//if there is nothing in storage, a new storage file is created next time.
		if(!obj) {
			shared.storage().get('playlists')
				.then(data => {
					if(data['playlists']) {
						for(let i = 0; i < data['playlists'].length; i++) {

							//adding playlists fro the storage
							//sets all parameters in the currently adding playlist.
							//go see addPlaylist() definition above.
							addPlaylist(data['playlists'][i].id,
								data['playlists'][i].lastVideo,
								data['playlists'][i].currentVideo,
								data['playlists'][i].currentVideoWatchTime);
							
						}
					}
					console.log('playlists loaded and added..');
					console.log(shared.getPlaylists());
				})
				.catch(error => {
					console.log(error);
				});

		}
		
		//else an object was provided, load the playlists from there
		//storage object will be overridden.
		else {
			//to be implemented in the future.
		}

	}

	function loadConfig() {
		let config;
		shared.storage().get('config').then(data => {
			if(isEmpty(data)) {
				config = {
					'dark':false,
					'autoplay':false,
					'iframe':true,
					'alwaysontop':false,
					'default': 'sequential',
					'watchTimeThresh': 0.90
				}
			} else {
				config = data;
			}
			shared.setConfig(config);
		});
	}

	function isEmpty(obj){
		return Object.keys(obj).length === 0;
	}

}