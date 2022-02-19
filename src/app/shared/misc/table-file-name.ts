import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TableFileName {
  fileNames = {
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
  };

  constructor() {
  }

  fileName(tableName: string) : string {
    return this.fileNames[tableName];
  }

  setFileName( tableName: string, fileName: string) {
    this.fileNames[tableName] = fileName;
  }
}

