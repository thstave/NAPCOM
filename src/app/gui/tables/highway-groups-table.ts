import {IFieldAttributes} from "./i-json-table-data";
import {RunDataService} from "../../service/run-data.service";
import {AbstractJsonTableData} from "./abstract-json-table-data";
import {SystemConfigService} from "../../service/system-config.service";
import {MatTableDataSource} from "@angular/material/table";

export class HighwayGroupsTable extends AbstractJsonTableData {

  private attributes : IFieldAttributes[] = [
    {colId:"", title:"", editable:false, type:"number"},
    {colId:"", title:"Class 2006", editable:false, type:"text"},
    {colId:"", title:"Class Code 2006", editable:false, type:"number"},
    {colId:"", title:"Highway Group 2006", editable:false, type:"number"},
    {colId:"", title:"Class Code 2016", editable:false, type:"number"},
    {colId:"", title:"Class 2016", editable:false, type:"text"}
  ];

  fileName: string;
  heading: string;
  isTableEditable: boolean;
  usePaging: boolean;
  rowCount: number;
  noHeading: boolean;

  constructor(private runDataService: RunDataService, private configService: SystemConfigService) {
    super(<any[]>runDataService.runData.highwayGroups);

    this.heading = "Highway Groups";
    this.fileName = configService.fileName('HighwayGroups');
    this.isTableEditable = false;
    this.usePaging = false;
    this.rowCount = -1;
    this.noHeading = false;
    this.relateAttributes(this.attributes);
  }

  //  We have to rebuild the table data.
  setJsonData(json) {
    this.jsonData = json;
    this.runDataService.runData.highwayGroups = json;
    this.relateAttributes(this.attributes);
    this.dataSource = new MatTableDataSource([...json]);
  }
}
