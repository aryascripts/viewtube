# ViewTube
ViewTube is a YouTube playlist application to manage and watch playlists on YouTube. The main purpose of this application is to manage watched videos (partial or full) whether it is a sequential playlist or non-sequential. Having the playlists you are watching currently from YouTube in one place can be helpful and easier to keep up with.

## Features
+ Add any YouTube playlist
+ Partially watch videos to resume later
+ Sort playlists alphabetically by channel or playlist name
+ Mark playlist as a sequential or non-sequential playlist
+ Change behavior of all playlist types individually
+ Backup playlist data and settings (from file)
+ Restore playlist data and settings (from file)

## Installation
Support for Windows, Mac OS, Linux. Currently a binary file is not made.
To run the program follow the following:
1. `yarn install`
1. `yarn run electron:serve`
1. `yarn run ng:serve`

## MVP List
- [x] Development mode IPC communication
- [x] Production mode index.html loading
- [x] Read existing tokens from file
- [x] Refresh the token if it has expired
- [x] Production mode scripts for mac, windows, linux
- [ ] Create icon for release
- [x] Get account name for top left box
- [x] pass on OAuth2 Client to FE, and use as-is
- [x] Search for playlists
- [x] Save files to 'Documents/viewtube'
- [x] Decode ID JTW token to get name and email
- [ ] Add logout option
- [x] Load playlist videos for "resume" on homepage (if not loaded)
- [x] Get account playlists
- [x] Store playlist in JSON form in neDB
- [x] Store watched videos in NEDB (playlistId, videoId, watchedPercentage)
- [x] Display watched percentages on the UI (playlist-view)
- [x] Sequential Playlists - load next video automatically
	- Handle the following: 
	- [x] Mark videos watched with for ones before
	- [x] Mark videos next as unwatched
	- [x] Load next video at stopped time when Resumed
	- [x] Load next page if next video is not available
- [ ] Random Playlists - 
		- Handle loading from current page
		- After exhaustion, load from next page
[x] Playlist summary next to resume
- [ ] Add settings page
		- [ ] Default playlist type (sequential or random)
		- [ ] Export data to file
		- [ ] Import data from file
		- [ ] Mark videos watched after x percentage
- [ ] Cache youtube calls

## Nice to Have list
[ ] Google Drive backup integration
[x] Switch to Yarn
[ ] Switch to React.js

## SETTINGS TO ADD - 
[ ] Default playlist type (random, sequential)
[ ] auto-play videos
[ ] Backup data to file
[ ] restore data from file