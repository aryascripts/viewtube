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
1. cd viewtube/ng4-rewrite/
2. npm i
3. npm start

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
- [x] Get account playlists
- [x] Store playlist in JSON form in neDB
- [x] Store watched videos in NEDB (playlistId, videoId, watchedPercentage)
- [ ] Display watched percentages on the UI (playlist-view)
- [ ] Sequential Playlists - load next video automatically
	- [ ] Handle the following: 
	- [ ] Mark videos watched with for ones before
	- [ ] Mark videos next as unwatched
	- [ ] Load next video at stopped time when Resumed
	- [ ] Load next page if next video is not available
- [ ] Random Playlists - 
	- [ ] Handle loading from current page
	- [ ] After exhaustion, load from next page
- [ ] Playlist summary next to resume
- [ ] Add settings page
	- [ ] Default playlist type (sequential or random)
	- [ ] Export data to file
	- [ ] Import data from file
	- [ ] Mark videos watched after x percentage
	- [ ] Logout option
- [ ] Remove Playlists from Custom
- [ ] Mark videos watched
- [ ] Mark videos unwatched

## Nice to Have list
- [ ] Google Drive backup integration
- [ ] Cache youtube calls

## SETTINGS TO ADD - 
- [ ] Default playlist type (random, sequential)
- [ ] auto-play videos
- [ ] Backup data to file
- [ ] restore data from file
