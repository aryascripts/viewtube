const YouTubePlayer = require('youtube-player');
const player = YouTubePlayer('player');
const electron = require('electron');
let id;

window.addEventListener('popstate', handleUrlChange);
window.addEventListener('beforeunload', sendUpdateTime);

handleUrlChange(window.location.href);
function handleUrlChange(href) {
	const searchParams = getSearchParams(href);
	id = searchParams.videoId;
	player.loadVideoById(id, +searchParams.time);
	player.playVideo();
	player.getVideoUrl();

	player.on('stateChange', handleStateChange);

	console.log(player);

	setInterval(sendUpdateTime, 30000);
}

function getSearchParams() {
	const search = window.location.search.slice(1);
	const params = search.split('&');
	const obj = {};
	params.forEach(param => {
		const keyVal = param.split('=');
		obj[keyVal[0]] = keyVal[1];
	});
	return obj;
}

async function getVideoData() {
	const currentTime = await player.getCurrentTime();
	const duration = await player.getDuration();
	return {
		time: currentTime,
		duration: duration,
		videoId: id
	};
}

async function sendUpdateTime() {
	electron.ipcRenderer.send('update-time', await getVideoData());
}

async function handleStateChange(state) {
	// Once video ends, play next
	if (state.data === 0) {
		electron.ipcRenderer.send('play-next', await getVideoData());
	}
}