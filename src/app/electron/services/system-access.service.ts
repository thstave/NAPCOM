import { Injectable } from '@angular/core';
import {ElectronService} from "./electron.service";

@Injectable({
  providedIn: 'root'
})
export class SystemAccessService {

  constructor(private electronService: ElectronService) { }

  /**
   * Opens the passed file in the system's default application for the file type.
   *
   * @param dirname
   * @param fileNm
   */
  openInApplication( dirname: string, fileNm:string) {
    return this.electronService.shell.openPath(this.electronService.path.join(dirname, fileNm));
  }

  exit() {
    const w = this.electronService.remote.getCurrentWindow();
    w.close();
  }

  browse(folder: string) {
    return this.electronService.remote.dialog.showOpenDialog({title: 'Select a folder',
      defaultPath: folder,
      properties: ['openDirectory', 'createDirectory', 'promptToCreate']});
  }

  copyDir(from:string, to:string) {
    return this.electronService.fs.copy(from, to);
  }
}
