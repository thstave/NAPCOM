import {Component} from '@angular/core';
import {SidenavAction} from "../../shared/misc/sidebar-content-enum";
import {IJsonTableData} from "../../gui/tables/i-json-table-data";
import {HpmsTable} from "../../gui/tables/hpms-table";
import {FipsCodesTable} from "../../gui/tables/fips-codes-table";
import {HighwayGroupsTable} from "../../gui/tables/highway-groups-table";
import {CountyFipsLatLongTable} from "../../gui/tables/county-fips-lat-long-table";
import {Merra2Table} from "../../gui/tables/merra2-table";
import {BaseModulusTable} from "../../gui/tables/base-modulus-table";
import {SubgradeModulusTable} from "../../gui/tables/subgrade-modulus-table";
import {LoadNewComponent} from "../../gui/dialogs/load-new/load-new.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {RunDataService} from "../../service/run-data.service";
import {SoilPropertiesTable} from "../../gui/tables/soil-properties-table";
import {AxleloadSiTable} from "../../gui/tables/axleloadsi-table";
import {AxleloadTaTable} from "../../gui/tables/axleloadta-table";
import {AxleloadTrTable} from "../../gui/tables/axleloadtr-table";
import {SystemAccessService} from "../../electron/services";
import {SystemConfigService} from "../../service/system-config.service";
import {AxleConfigurationTable} from "../../gui/tables/axle-configuration-table";
import {HmaGradationVolumetricsTable} from "../../gui/tables/hma-gradation-volumetrics-table";
import {LtppEstarCoeffsTable} from "../../gui/tables/ltpp-estar-coeffs-table";


@Component({
  selector: 'app-main-app',
  templateUrl: './main-app.component.html',
  styleUrls: ['./main-app.component.scss']
})
export class MainAppComponent {

  sidenavContent = SidenavAction;
  events: string[] = [];
  opened = true;
  selectedMenuItem: SidenavAction = SidenavAction.Home;

  constructor(
    private dialog: MatDialog,
    private runDataService: RunDataService,
    private configService: SystemConfigService,
    private systemAccessService: SystemAccessService) {
  }

  sideBarToggle() {
    this.opened = !this.opened;
  }

  setContent(action: SidenavAction) {
    if (action === SidenavAction.Close) {
      this.systemAccessService.exit();
    }
    this.selectedMenuItem = action;
  }

  openDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    this.dialog.open(LoadNewComponent, dialogConfig);
  }

  onSidenavAction(action:SidenavAction) {
    this.setContent(action);
  }

  tableData(action: SidenavAction): IJsonTableData {
    let data: IJsonTableData;
    switch (action) {

      case SidenavAction.HPMSData: {
        data = new HpmsTable(this.runDataService, this.configService);
        break;
      }
      case SidenavAction.StatesRegions: {
        data = new FipsCodesTable(this.runDataService, this.configService);
        break;
      }
      case SidenavAction.HighwayGroups: {
        data = new HighwayGroupsTable(this.runDataService, this.configService);
        break;
      }
      case SidenavAction.SpectraCountyData: {
        data = new CountyFipsLatLongTable(this.runDataService, this.configService);
        break;
      }
      case SidenavAction.MERRA2List: {
        data = new Merra2Table(this.runDataService, this.configService);
        break;
      }
      case SidenavAction.BaseDefaults: {
        data = new BaseModulusTable(this.runDataService, this.configService);
        break;
      }
      case SidenavAction.AxleConfiguration: {
        data = new AxleConfigurationTable(this.runDataService, this.configService);
        break;
      }
      default: {
        //statements;
        break;
      }
    }

    return data;
  }

  tableArray(action: SidenavAction): IJsonTableData[] {
    const data: IJsonTableData[] = [];

    switch (action) {

      case SidenavAction.HMADefaults: {
        data.push(new LtppEstarCoeffsTable(this.runDataService, this.configService));
        data.push(new HmaGradationVolumetricsTable(this.runDataService, this.configService));
        break;
      }
      case SidenavAction.AxleLoad: {
        data.push(new AxleloadSiTable(this.runDataService, this.configService));
        data.push(new AxleloadTaTable(this.runDataService, this.configService));
        data.push(new AxleloadTrTable(this.runDataService, this.configService));
        break;
      }
      case SidenavAction.SubgradeDefaults: {
        data.push(new SubgradeModulusTable(this.runDataService, this.configService));
        data.push(new SoilPropertiesTable(this.runDataService, this.configService));
        break;
      }

      default: {
        //statements;
        break;
      }
    }

    return data;
  }

  directoryLoaded() {
    return this.configService.directoryDefined();
  }

  currentDirectory() {
    return this.configService.workingDirectory;
  }

}
