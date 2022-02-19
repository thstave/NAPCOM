import { Injectable } from '@angular/core';
import {JsonInputService} from "../electron/services";

@Injectable({
  providedIn: 'root'
})
export class SystemConfigService {

  private _workingDirectory : string = undefined;

  private _appConfigFileName = "app_config.json";
  // System Default Directory
  defaultDataDirectory = '../Data';
  dataHasBeenRead = false;

  // Default file names.
  private _defaultAppConfigData = {
    period: "20",
    states: "1,2,5,23",
    highwayTypes: "1,2,4",
    pavementTypes: "1,2,3",
    fileNames : {
      'HPMSData': "hpms2018_4_rev.csv",
      'StatesRegions': "FIPSCodes.csv",
      'HighwayGroups': "HighwayGroups.csv",
      'AxleConfiguration': "config_2017.csv",
      'AxleLoadSi': "alsSiGrandM.csv",
      'AxleLoadTa': "alsTaGrandM.csv",
      'AxleLoadTr': "alsTrGrandM.csv",
      'CountyData': "CountyFIPS_Lat_Long.csv",
      'MERRA2List': "MERRA2LIST.csv",
      'EstarCoeffs': 'LTPP_Estar_Coeffs.csv',
      'HMAGradation': "HMA_gradation_volumetrics.csv",
      'BaseDefaults': "Base_Modulus.csv",
      'SubgradeDefaults': "Subgrade_Modulus.csv",
      'SoilProperties': "Soil_Properties.csv"
    }
  };

  appConfigData = undefined;

  constructor(private jsonInputService:JsonInputService) {
    this.readConfigData();
  }

  public filePath(tableName: string): string {
    let dir = this.workingDirectory;
    if ( dir.slice(-1) !== "/") {
      dir = dir + '/';
    }
    return dir + this.fileName(tableName);
  }

  public get workingDirectory() : string {
    return (this._workingDirectory === undefined) ? this.defaultDataDirectory : this._workingDirectory;
  }

  public set workingDirectory(workingDirectory)  {
    this._workingDirectory = workingDirectory;
  }

  fileName(tableName: string) : string {

    const fn : string = this.appConfigData.fileNames[tableName];
    console.log(`tableName: ${tableName}  fileName: ${fn}`);
    return this.appConfigData.fileNames[tableName];
  }

  setFileName( tableName: string, fileName: string) {
    console.log(`Set filename ${fileName}`);
    if (fileName.startsWith(this.workingDirectory)) {

      // add one to remove the '/'
      fileName = fileName.slice(this.workingDirectory.length + 1);
      console.log(`Set filename ${fileName}`);
    }
    this.appConfigData.fileNames[tableName] = fileName;
  }

  writeConfigData() {
    const configName = this.workingDirectory + "/" + this._appConfigFileName;
    return this.jsonInputService.writeJson(configName, this.appConfigData);
  }

  readConfigData() {
    const configName = this.workingDirectory + "/" + this._appConfigFileName;
    return new Promise<void>((resolve, reject) => {

      this.jsonInputService.fetchJson(configName).then( obj => {
        this.appConfigData = obj;
        resolve();
      }).catch(err => {
        //  No config data in directory.  Create one with the default data.
        this.jsonInputService.writeJson(configName, this._defaultAppConfigData).then( obj => {
          this.appConfigData = this._defaultAppConfigData;
          resolve();
        }).catch(err => {
          // Couldn't find one and couldn't write one.
          reject();
        } );
      });
    });
  }
}
