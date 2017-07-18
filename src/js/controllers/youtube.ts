const YouTubePlayer = require('youtube-player');
const {ipcRenderer} = require('electron');

console.log('running message line next ');

var id = window.location.search.substring(1).split('=')[1];


var player = YouTubePlayer('player', {videoId: id});


player
	.playVideo()
	.then(() => {
		console.log('playing video...')
	});

player.on('stateChange', (event) => {
	console.log(event);
	if(event.data === 0) {
		console.log('video ended... queuing send command');
		ipcRenderer.send('next-video');
	}
});

window.onbeforeunload = function() {
	player.getCurrentTime().then(data => {
		ipcRenderer.send('video-closed', data);
	})
}
