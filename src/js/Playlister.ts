import { Playlist } from './Playlist';
import { HttpRequest } from './HttpRequest';
import { api_key } from './APIAuth';

var btnAdd:HTMLElement = document.getElementById('btn-url-add');
var urlInput:HTMLElement = document.getElementById('url-input-container');

var wrapper:HTMLElement = document.getElementById('main-wrapper');
var template = (<HTMLTemplateElement>document.getElementById('playlist-template'));

const prefix:string = 'https://www.youtube.com/playlist?list=';

//list of all the tabs for displaying
var playlists = [];
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
				displayPlaylist(plist);
			});
			playlists.push(plist);
		});
	}

	//Not a valid url for playlist
	else {
		console.log('Please enter a valid playlist URL. For example: ' + prefix + '...');
	}

	
}

function displayPlaylist(plist:Playlist) {
	var temp:HTMLElement = <HTMLElement>template.content.cloneNode(true);
	temp.querySelector('#plist-title').innerHTML = plist.getTitle();
	temp.querySelector('#channel-name').innerHTML = plist.getChannel();
	temp.querySelector('#video-count').innerHTML = plist.getLastVideoNumber().toString() + ' / ' + plist.getTotalVideos().toString();

	let thumbUrl = plist.getThumbnailUrl();
	temp.querySelector('#thumbnail').innerHTML = '<img src="' + thumbUrl + '" width="120px"/>';
	temp.querySelector('#description').innerHTML = plist.getDescription();
	wrapper.appendChild(temp);
}

//Goes to the Google server (with HttpRequest) and retreives the playlist information
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

//Goes to the Google server (with HttpRequest) and retreives the videos inside a playlist id
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
