import { Injectable } from '@angular/core';
import {ElectronService} from "./electron.service";
import {RunScript} from "./run-script";

export interface ScriptReturn {
  code: number,
  data: string
}

@Injectable({
  providedIn: 'root'
})
export class ScriptService {

  constructor(private electronService: ElectronService) {
  }

  /**
   * Creates a new instance of RunScript.  Once created, RunScript will handle the actual
   * logic of processing the script.
   */
  create() {
    return new RunScript(this.electronService);
  }



  runScript2(command) {

    return new Promise((resolve, reject) => {

      let returnData = "";
      const script = this.electronService.childProcess.spawn(command, {shell: true,
        cwd: process.cwd(),
        detached: true,
        stdio: 'inherit' //feed all child process logging into parent process
      });

      script.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        returnData = data;
      });

      script.on('error', (error) => {
        reject(error);
      });

      script.on('close', (code) => {
        const rtrn : ScriptReturn = { 'code':code,'data':returnData};
        resolve(rtrn);
      });
    });
  }

}
