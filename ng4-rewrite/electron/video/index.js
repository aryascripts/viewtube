const YouTubePlayer = require('youtube-player');

const player = YouTubePlayer('player');

window.addEventListener('popstate', handleUrlChange);

handleUrlChange(window.location.href);
function handleUrlChange(href) {
	const searchParams = getSearchParams(href);
	player.loadVideoById(searchParams.videoId);
	player.playVideo();
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
