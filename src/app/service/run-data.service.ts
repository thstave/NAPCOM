import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RunDataService {

  private _runData = {};
  private _analysisData = {};

  constructor() { }

  get runData(): any {
    return this._runData;
  }

  set runData(value: any) {
    this._runData = value;
  }

  get analysisData(): any {
    return this._analysisData;
  }

  set analysisData(value: any) {
    this._analysisData = value;
  }
}
