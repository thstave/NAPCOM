import {Injectable} from '@angular/core';
import {JsonInputService} from "../electron/services";

@Injectable({
    providedIn: 'root'
})
export class SystemConfigService {

    private _workingDirectory: string = undefined;

    _appConfigFileName = "app_config.json";
    // System Default Directory
    defaultDataDirectory = '../Data';
    dataHasBeenRead = false;

    // Default file names.
    private _defaultAppConfigData = {
        period: "20",
        states: "1,2,5,23",
        highwayTypes: "1,2,4",
        pavementTypes: "1,2,3",
        maxNumberOfRuns: "1000",
        anlHost: "login1.arrow.tracc.anl.gov",
        anlUser: "ac.mkutay",
        anlNodeCluster: "batch",
        anlPwd: "Dummy",
        pythonCmd: "/usr/local/opt/python@3.8/bin/python3",
        jobSubmitCmd: "submitJOBs.py",
        sendNapcomCmd: "sendNAPCOMfiles.py",
        localNapcomDir: "/Users/kutay/My Drive/_Docs/My Algorithms/_UPDAPS2Codes/_NAPCOMPlus/Deploy/",
        remoteNapcomDir: "/mnt/lustre/arrow/home/ac.mkutay/updapscodes/napcomplus/",
        napcomExt: "*.py",
        sendUpdapsCmd: "sendUPDAPSfiles.py",
        localUpdapsacDir: "/Users/kutay/My Drive/_Docs/My Algorithms/_UPDAPS2Codes/PythonCode_VECD_4Calibration",
        remoteUpdapsacDir: "/mnt/lustre/arrow/home/ac.mkutay/updapscodes/updapsac_vecd_3pt/",
        updapsacExt: "*.py, *.pkl, *.xlsx",
        checkConnectionCmd: "checkconnection.py",
        fileNames: {
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
        },
        fltstr: "state_code == 26 and surface_type == 2 and base_type == 2 and cracking_percent > 30.0 and thickness_flexible < 8.0 and year_last_improv < 2008 and year_last_improv > 1998",
        remotejsonfld: "/mnt/lustre/arrow/home/ac.mkutay/updapsruns/forMI/",
        cancelJOBSCmd: "cancelJOBs.py",
        checkJOBSCmd: "checkJOBs.py",
        computenumHPMSsecscmd: "checknumHPMSsecs.py",
        NAPCOMstatustxtfname: "NAPCOM_run_status.txt",
        UPDAPSstatustxtfname: "UPDAPS_run_status.txt",
        getUPDAPSRunStatusCmd: "checkUPDAPSrunstatus.py"
    };

    appConfigData = undefined;

    constructor(private jsonInputService: JsonInputService) {
        this.readConfigData();
    }

    public filePath(tableName: string): string {
        let dir = this.workingDirectory;
        if (dir.slice(-1) !== "/") {
            dir = dir + '/';
        }
        return dir + this.fileName(tableName);
    }

    public directoryDefined(): boolean {
        return (this._workingDirectory === undefined) ? false : true;
    }

    public get workingDirectory(): string {
        return (this._workingDirectory === undefined) ? this.defaultDataDirectory : this._workingDirectory;
    }

    public set workingDirectory(workingDirectory) {
        this._workingDirectory = workingDirectory;
    }

    fileName(tableName: string): string {

        const fn: string = this.appConfigData.fileNames[tableName];
        return this.appConfigData.fileNames[tableName];
    }

    setFileName(tableName: string, fileName: string) {
        if (fileName.startsWith(this.workingDirectory)) {

            // add one to remove the '/'
            fileName = fileName.slice(this.workingDirectory.length + 1);
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

            this.jsonInputService.fetchJson(configName).then(obj => {
                this.appConfigData = obj;
                resolve();
            }).catch(err => {
                //  No config data in directory.  Create one with the default data.
                this.jsonInputService.writeJson(configName, this._defaultAppConfigData).then(obj => {
                    this.appConfigData = this._defaultAppConfigData;
                    resolve();
                }).catch(err => {
                    // Couldn't find one and couldn't write one.
                    reject();
                });
            });
        });
    }
}
