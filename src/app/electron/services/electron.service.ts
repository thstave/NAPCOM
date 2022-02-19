import { Injectable } from '@angular/core';
import { ipcRenderer, webFrame, shell } from 'electron';
import * as remote from '@electron/remote';
import * as childProcess from 'child_process';
import * as fs from 'fs-extra';
import * as xlsx from 'xlsx';
import * as csv from 'csvtojson';
import * as path from 'path';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  xlsx: typeof xlsx;
  csv: typeof csv;
  shell: typeof shell;
  path: typeof path;

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.shell = window.require('electron').shell;
      this.remote = window.require('@electron/remote');

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs-extra');
      this.xlsx = window.require('xlsx');
      this.csv = window.require('csvtojson');
      this.path = window.require('path');
    }
  }
}

