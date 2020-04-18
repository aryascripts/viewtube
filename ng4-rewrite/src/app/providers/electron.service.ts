import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, IpcRendererEvent } from 'electron';
import * as childProcess from 'child_process';

@Injectable()
export class AppElectronService {

  ipcRenderer: typeof ipcRenderer;
  childProcess: typeof childProcess;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.childProcess = window.require('child_process');
    }
  }

  send(evt: string, obj: any) {
    this.ipcRenderer.send(evt, obj)
  }

  getSync(evt: string, obj?: any) {
    return this.ipcRenderer.sendSync(evt, obj);
  }

  isElectron = () => {
    return window.require !== undefined
  }

  listen(evt: string, fn: (event: IpcRendererEvent, ...args: any[]) => void) {
    this.ipcRenderer.on(evt, fn);
  }

}
