import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { remote, ipcRenderer } from 'electron';
import * as childProcess from 'child_process';

let {dialog} = remote;

@Injectable()
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  remote: typeof remote;
  childProcess: typeof childProcess;
  electronDialog: any;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
        this.ipcRenderer = window.require('electron').ipcRenderer;
        this.childProcess = window.require('child_process');
        this.remote = window.require('electron').remote;

        this.electronDialog = dialog;
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

}
