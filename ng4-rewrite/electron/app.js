"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var ipcMain = require('electron').ipcMain;
var main_1 = require("./main");
var authService_1 = require("./googleapi/authService");
var apiService_1 = require("./googleapi/apiService");
var youtube = null;
//Create main window
main_1["default"].main(electron_1.app, electron_1.BrowserWindow);
//Check for stored tokens
authService_1["default"].loadFromFile()
    .then(createYoutubeService)["catch"](function (err) {
    console.log('tokens not on file');
});
//Send signal to authorize client
ipcMain.on('authorize', function (event) {
    console.log('authorize');
    authService_1["default"].createAuthWindow();
});
ipcMain.on('create-youtube-service', function (client) {
    console.log('create-youtube-service');
    createYoutubeService(client)
        .then(function (resp) {
        return getAccountPlaylists();
    })
        .then(function (resp) {
        main_1["default"].sendMessage('my-playlists', resp);
    })["catch"](function (err) {
        console.log(err);
    });
});
ipcMain.on('get-account-playlists', function (event, nextPage) {
    if (nextPage === void 0) { nextPage = null; }
    console.log('get-account-playlists');
    getAccountPlaylists(nextPage)
        .then(function (resp) {
        console.log('sending... my-playlists');
        event.sender.send('my-playlists', resp);
    })["catch"](function (err) {
        console.log(err);
    });
});
ipcMain.on('check-client', function (event) {
    var val = youtube ? true : false;
    event.sender.send('check-client', val);
});
ipcMain.on('search-params', function (event, params) {
    youtube.searchPlaylists(params)
        .then(function (res) {
        console.log('sending... search-params-results');
        event.sender.send('search-params-results', {
            'status': 200,
            'params': params,
            'res': res
        });
    })["catch"](function (err) {
        event.sender.send('search-params-results', {
            'status': 500,
            'res': err
        });
    });
});
ipcMain.on('login-cancelled', function (event) {
    main_1["default"].sendMessage('login-cancelled', null);
});
function createYoutubeService(client) {
    if (!youtube)
        youtube = new apiService_1.YoutubeApiService(client);
    return Promise.resolve(youtube);
}
function getAccountPlaylists(nextPage) {
    if (nextPage === void 0) { nextPage = null; }
    if (!youtube) {
        ipcMain.emit('authorize');
    }
    return youtube.getAccountPlaylists(nextPage);
}
