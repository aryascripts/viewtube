import { Playlist } from './Playlist';
import { HttpRequest } from './HttpRequest';
import { api_key } from './Auth'

var btnAdd:HTMLElement = document.getElementById('btn-url-add');
var urlInput:HTMLElement = document.getElementById('url-input-container');
const prefix:string = 'https://www.youtube.com/playlist?list=';

//list of all the tabs for displaying
var playlists: Array<Playlist> = [];
var request = new HttpRequest();

//shows and hides the add button
//first you toggle the add form, then if the check button is pressed,
//add a new tab with provided URL and place the repository name.
btnAdd.addEventListener('click', () => {
	toggleAddForm();

	let checkButton:HTMLElement = document.getElementById('btn-check');

	if(urlInput.innerHTML.trim() !== '') {
		checkButton.addEventListener('click', () => {
			addPlaylist();
			toggleAddForm();
		});
	}
});

//Creates a new Playlist object based on the url in the form.
//Pushes object to the array of all playlists currently tracking
//Called on checkmark button press
function addPlaylist() {
	let url:string = (<HTMLInputElement>document.getElementById('url-text')).value;

	//Check of the user inserted a valid url for a playlist
	if(url.startsWith(prefix)) {
		let plist;

		let id = url.split('=')[1];

		getPlaylistInfo(id).then(info => {
			plist = new Playlist(info);
			getVideos(id).then(videos => {
				plist.addVideos(videos);
			});
			playlists.push(plist);
		});

		console.log(playlists);
	}

	//Not a valid url for playlist
	else {
		console.log('Please enter a valid playlist URL. For example: ' + prefix + '...')
	}
}

function getPlaylistInfo(id:string) {
	var info;
	let location = 'https://www.googleapis.com/youtube/v3/playlists';
	let headers = {
		'id': id,
		'part':'snippet',
		'key': api_key,
	}

	return request.getResponse(location, headers)
		.then(data => {
			return data['items'];
		})
		.catch(error => {
			console.log(error);
		});
}

function getVideos(id:string) {
	let location = 'https://www.googleapis.com/youtube/v3/playlistItems';
	let headers = {
		'playlistId': id,
		'part':'snippet',
		'key': api_key
	}

	return request.getResponse(location, headers)
		.then(data => {
			return data['items'];
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

	let formElements:string = '<input id="url-text" style="width: 50%;" class="text-input" type="text" placeholder=" https://www.youtube.com/playlist?list=..."><div id="btn-check" class="btn btn-default"><span class="icon icon-check"></span></div>';
	urlInput.innerHTML = urlInput.innerHTML.trim() == '' ? formElements : '';
}

function toggleBackButton() {
	let backButton:HTMLElement = document.getElementById('btn-back');
	backButton.classList.toggle('hidden');
}
