import {IFieldAttributes} from "./i-json-table-data";
import {RunDataService} from "../../service/run-data.service";
import {AbstractJsonTableData} from "./abstract-json-table-data";
import {SystemConfigService} from "../../service/system-config.service";
import {MatTableDataSource} from "@angular/material/table";

export class FipsCodesTable extends AbstractJsonTableData {

  private attributes : IFieldAttributes[] = [
    {colId:"", title:"", editable:false, type:"number"},
    {colId:"", title:"FIPS Code", editable:false, type:"number"},
    {colId:"", title:"State", editable:false, type:"text"},
    {colId:"", title:"State Abrv", editable:false, type:"text"},
    {colId:"", title:"Napcom Region", editable:false, type:"number"},
    {colId:"", title:"Ground Water Depth (ft)", editable:false, type:"number"},
    {colId:"", title:"Notes", editable:false, type:"text"}
  ];

  fileName: string;
  heading: string;
  isTableEditable: boolean;
  usePaging: boolean;
  rowCount: number;
  noHeading: boolean;

  constructor(private runDataService: RunDataService, private configService: SystemConfigService) {
    super(<any[]>runDataService.runData.fipsCode);

    this.heading = "States - Regions";
    this.fileName = configService.fileName('StatesRegions');
    this.isTableEditable = false;
    this.usePaging = false;
    this.rowCount = -1;
    this.noHeading = false;
    this.relateAttributes(this.attributes);
  }

  //  We have to rebuild the table data.
  setJsonData(json) {
    this.jsonData = json;
    this.runDataService.runData.fipsCode = json;
    this.relateAttributes(this.attributes);
    this.dataSource = new MatTableDataSource([...json]);
  }
}
