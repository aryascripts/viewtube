import { app, BrowserWindow, } from 'electron';
const {ipcMain} = require('electron');

import Main from './main';
import AuthService from './googleapi/authService';

//Create main window
Main.main(app, BrowserWindow);

//Send signal to authorize client
ipcMain.on('authorize', (event) => {
	AuthService.createAuthWindow();
});

