"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var OAuth2Client = require('google-auth-library').OAuth2Client;
var url = require('url');
var fs = require('fs');
var electron_1 = require("electron");
var SCOPES = [
    'https://www.googleapis.com/auth/youtube',
    'profile', 'email'
];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.viewtube/';
var TOKEN_PATH = TOKEN_DIR + 'token.json';
var AuthService = /** @class */ (function () {
    function AuthService() {
    }
    AuthService.getOAuthClient = function () {
        if (this.authorized) {
            return this.oAuth2Client;
        }
        else {
            this.createAuthWindow();
            return 'not-authorized';
        }
    };
    AuthService.loadFromFile = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            fs.readFile(TOKEN_PATH, function (err, token) {
                if (err) {
                    reject(err);
                }
                else {
                    _this.setOauthCredentials(JSON.parse(token), false);
                    resolve(_this.oAuth2Client);
                }
            });
        });
    };
    AuthService.getAuthUrl = function (client) {
        // Generate the url that will be used for the consent dialog.
        return this.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES
        });
    };
    //authorization popup and events/url navigation
    AuthService.createAuthWindow = function () {
        var _this = this;
        if (this.authWin)
            return; //window already exists.
        console.log('opening...');
        this.authWin = new electron_1.BrowserWindow({
            width: 600,
            height: 750,
            minWidth: 400,
            minHeight: 600,
            acceptFirstMouse: true,
            alwaysOnTop: true //cannot escape
        });
        this.authWin.loadURL(this.getAuthUrl(this.oAuth2Client), {
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) old-airport-include/1.0.0 Chrome Electron/7.1.7 Safari/537.36'
        });
        this.authWin.on('closed', this.onClose.bind(this));
        //detects when the user has completed authorization
        this.authWin.webContents.on('will-navigate', function (event, url) {
            _this.handleNavigate(url); //url of the window
        });
    };
    AuthService.onClose = function () {
        this.authWin = null;
        electron_1.ipcMain.emit('login-cancelled');
        console.log('Authorization was cancalled by user.');
    };
    AuthService.handleNavigate = function (newUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var parsed, appCode, tk;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parsed = url.parse(newUrl, true);
                        if (!parsed) return [3 /*break*/, 2];
                        if (parsed.error) {
                            console.log("Error: " + parsed.error);
                            return [2 /*return*/];
                        }
                        else if (parsed.query.response == 'error=access_denied') {
                            console.log('Authorization was cancelled.');
                            this.authWin.close();
                            return [2 /*return*/];
                        }
                        appCode = parsed.query.approvalCode;
                        if (!appCode) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getToken(appCode)];
                    case 1:
                        tk = _a.sent();
                        this.setOauthCredentials(tk.tokens);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.setOauthCredentials = function (tokens, store) {
        if (store === void 0) { store = true; }
        console.log(tokens);
        if (store)
            this.storeToken(tokens);
        this.oAuth2Client.setCredentials(tokens);
        this.authorized = true;
        this.informCreation();
    };
    AuthService.getToken = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.oAuth2Client.getToken(code)];
                    case 1:
                        token = _a.sent();
                        if (token.res.status === 200) {
                            this.authWin.removeAllListeners('closed');
                            this.authWin.close();
                            return [2 /*return*/, token];
                        }
                        else {
                            console.error('There was an error receiving authentication tokems from Google.' + token);
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.storeToken = function (token) {
        try {
            fs.mkdirSync(TOKEN_DIR);
        }
        catch (err) {
            if (err.code != 'EEXIST') {
                throw err;
            }
        }
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), function (err) {
            if (err)
                throw err;
        });
        console.log('Token stored to ' + TOKEN_PATH);
    };
    AuthService.informCreation = function () {
        electron_1.ipcMain.emit('create-youtube-service', this.oAuth2Client);
    };
    AuthService.oAuth2Client = new OAuth2Client({
        clientId: '820911348472-7q79l53ae1tt9ol0dvh8jcuc68ec4e4f.apps.googleusercontent.com',
        redirectUri: 'urn:ietf:wg:oauth:2.0:oob'
    });
    AuthService.authWin = null;
    return AuthService;
}());
exports["default"] = AuthService;
