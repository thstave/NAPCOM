import {IFieldAttributes} from "./i-json-table-data";
import {RunDataService} from "../../service/run-data.service";
import {AbstractJsonTableData} from "./abstract-json-table-data";
import {SystemConfigService} from "../../service/system-config.service";
import {MatTableDataSource} from "@angular/material/table";

export class Merra2Table extends AbstractJsonTableData {

  private attributes : IFieldAttributes[] = [
    {colId:"", title:"", editable:false, type:"number"},
    {colId:"", title:"HCM Filename", editable:false, type:"text"},
    {colId:"", title:"MERRA Id", editable:false, type:"number"},
    {colId:"", title:"Latitude", editable:false, type:"number"},
    {colId:"", title:"Longitude", editable:false, type:"number"},
    {colId:"", title:"Elevation(m)", editable:false, type:"number"},
    {colId:"", title:"MERRA LAT Index", editable:false, type:"number"},
    {colId:"", title:"MERRA LONG Index", editable:false, type:"number"},
    {colId:"", title:"Grid Type", editable:false, type:"text"},
    {colId:"", title:"Country", editable:false, type:"text"},
    {colId:"", title:"State", editable:false, type:"text"},
    {colId:"", title:"Resolution", editable:false, type:"number"},
    {colId:"", title:"MERRA Grid Code", editable:false, type:"text"},
    {colId:"", title:"UTC Standard", editable:false, type:"number"},
    {colId:"", title:"Daylight Savings Diff", editable:false, type:"number"}
  ];

  fileName: string;
  heading: string;
  isTableEditable: boolean;
  usePaging: boolean;
  rowCount: number;
  noHeading: boolean;

  constructor(private runDataService: RunDataService, private configService: SystemConfigService) {
    super(<any[]>runDataService.runData.merra2List);

    this.heading = "MERRA2 List";
    this.fileName = configService.fileName('MERRA2List');
    this.isTableEditable = false;
    this.usePaging = true;
    this.rowCount = -1;
    this.noHeading = false;
    this.relateAttributes(this.attributes);
  }

  //  We have to rebuild the table data.
  setJsonData(json) {
    this.runDataService.runData.merra2List = json;
    this.relateAttributes(this.attributes);
    this.dataSource = new MatTableDataSource([...json]);
  }
}
