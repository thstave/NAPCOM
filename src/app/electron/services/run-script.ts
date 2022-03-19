import {ElectronService, ScriptReturn, ScriptService} from "./index";
import {ChildProcess} from "child_process";

/**
 * A non-angular class.  As such the electron service will need to be passed into it
 * in a new instance.
 *
 * Used to create an instance of a run.  A instance version of the runscript is used so that
 * the child process can be stored and later canceled.
 */
export class RunScript {

  private _child : ChildProcess = undefined;

  constructor(private electronService: ElectronService) {}

  get child() {
    return this._child;
  }

  /**
   * Returns a promise which will run the script file. If a callback is included, all
   * changes from the script will be passed to the callback.  This will permit live updates.
   *
   * On failure it will return the error from the spawn command.
   * On success it will return the return code and any data in a
   * structure of {'code': code, 'data': return data}
   *
   * @param command  - the command to run
   * @param args     - any arguments required (they could also be passed in the command)
   * @param callback - used to provide live updates.
   */

  public run(command: string, args, callback?:(dat: string) => any) : Promise<any> {

    return new Promise((resolve, reject) => {

      let returnData = "";
      // this._child = this.electronService.childProcess.spawn(command, (args as any[]), {shell: true});
      this._child = this.electronService.childProcess.spawn(command, (args as any[]), {shell: true,
        cwd: process.cwd(),
        detached: true,
        stdio: 'inherit' //feed all child process logging into parent process
      });

      this._child.stdout.on('data', (data) => {
        returnData = data;
        if (callback) {
          callback(<string>data);
        }
      });

      this._child.on('error', (error) => {
        reject(error);
      });

      this._child.on('close', (code) => {
        const rtrn : ScriptReturn = { 'code':code,'data':returnData};
        resolve(rtrn);
      });
    });
  }

  public runNoLive(command: string, args, callback?:(dat: string) => any) : Promise<any> {

    return new Promise((resolve, reject) => {

      let returnData = "";
      // this._child = this.electronService.childProcess.spawn(command, (args as any[]), {shell: true});
      this._child = this.electronService.childProcess.spawn(command, (args as any[]), {shell: true});

      this._child.stdout.on('data', (data) => {
        returnData = data;
        if (callback) {
          callback(<string>data);
        }
      });

      this._child.on('error', (error) => {
        reject(error);
      });

      this._child.on('close', (code) => {
        const rtrn : ScriptReturn = { 'code':code,'data':returnData};
        resolve(rtrn);
      });
    });
  }

  cancel() {
    if ( this._child ) {
      // kill the live updates
      this._child.stdout.destroy();
    }
  }

}
