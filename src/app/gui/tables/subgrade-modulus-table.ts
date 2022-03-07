import {IFieldAttributes} from "./i-json-table-data";
import {RunDataService} from "../../service/run-data.service";
import {AbstractJsonTableData} from "./abstract-json-table-data";
import {SystemConfigService} from "../../service/system-config.service";
import {MatTableDataSource} from "@angular/material/table";

export class SubgradeModulusTable extends AbstractJsonTableData {

  private attributes : IFieldAttributes[] = [
    {colId:"", title:"", editable:false, type:"number"},
    {colId:"", title:"HPMS Surface Code", editable:false, type:"number"},
    {colId:"", title:"HPMS Soil Code", editable:false, type:"number"},
    {colId:"", title:"Subgrade Resilient PSI", editable:false, type:"number"}
  ];

  fileName: string;
  heading: string;
  isTableEditable: boolean;
  usePaging: boolean;
  rowCount: number;
  noHeading: boolean;

  constructor(private runDataService: RunDataService, private configService: SystemConfigService) {
    super(<any[]>runDataService.runData.subgradeModulus);

    this.heading = "Subgrade Defaults";
    this.fileName = configService.fileName('SubgradeDefaults');
    this.isTableEditable = false;
    this.usePaging = false;
    this.rowCount = 6;
    this.noHeading = false;
    this.relateAttributes(this.attributes);
  }

  //  We have to rebuild the table data.
  setJsonData(json) {
    this.runDataService.runData.subgradeModulus = json;
    this.relateAttributes(this.attributes);
    this.dataSource = new MatTableDataSource([...json]);
  }
}
