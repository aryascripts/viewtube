const YouTubePlayer = require('youtube-player');
const {ipcRenderer} = require('electron');

var args = window.location.search.substring(1).split('&');
var id = args[0].split('=')[1];
var t = args[1].split('=')[1];
var time = (t) ? t : 0;

console.log(time);


var player = YouTubePlayer('player',
	{
		videoId: id,
		playerVars: {
			start: time
		}
	}
	);


player
	.playVideo()
	.then(() => {

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
