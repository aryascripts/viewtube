import { Playlist } from './Playlist';

var btnAdd:HTMLElement = document.getElementById('btn-url-add');
var urlInput:HTMLElement = document.getElementById('url-input-container');
const prefix = 'https://www.youtube.com/playlist?list=';

//list of all the tabs for displaying
var playlists = [];

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

function addPlaylist() {
	let url:string = (<HTMLInputElement>document.getElementById('url-text')).value;
	
	if(url.startsWith(prefix)) {
		let id = url.split('=')[1];
		playlists.push(new Playlist(id));
		playlists[0].display();
	}
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
	console.log('hiding')
}
