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


## TODO List
[x] Development mode IPC communication
[x] Production mode index.html loading
[x] Read existing tokens from file
[x] Refresh the token if it has expired
[x] Production mode scripts for mac, windows, linux
[ ] Create icon for release
[x] Get account name for top left box
[ ] pass on OAuth2 Client to FE, and use as-is
[ ] Get account playlists
[ ] Search for playlists
[ ] Google Drive backup integration
[ ] Save files to 'Documents/viewtube'
[ ] Decode ID JTW token to get name and email
[ ] Add logout option
[ ] Get account playlists
[ ] Store playlist in JSON form in neDB