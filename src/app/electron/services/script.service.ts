import { Injectable } from '@angular/core';
import {ElectronService} from "./electron.service";

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

  // Converts the spawn command to a promise.
  // On failure it will return the error from the spawn command.
  // On success it will return the return code and any data in a
  // structure of {'code': code, 'data': return data}
  runScript(command, args) {

    return new Promise((resolve, reject) => {

      let returnData = "";
      const script = this.electronService.childProcess.spawn(command, (args as any[]), {shell: true});


      script.stdout.on('data', (data) => {
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
