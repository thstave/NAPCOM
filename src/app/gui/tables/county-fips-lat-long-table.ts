import {IFieldAttributes} from "./i-json-table-data";
import {RunDataService} from "../../service/run-data.service";
import {AbstractJsonTableData} from "./abstract-json-table-data";
import {SystemConfigService} from "../../service/system-config.service";
import {MatTableDataSource} from "@angular/material/table";

export class CountyFipsLatLongTable extends AbstractJsonTableData {

  private attributes : IFieldAttributes[] = [
    {colId:"", title:"", editable:false, type:"number"},
    {colId:"", title:"State", editable:false, type:"text"},
    {colId:"", title:"County", editable:false, type:"text"},
    {colId:"", title:"County FIPS", editable:false, type:"number"},
    {colId:"", title:"Time Zone", editable:false, type:"text"},
    {colId:"", title:"Lon", editable:false, type:"number"},
    {colId:"", title:"LAT", editable:false, type:"number"},
    {colId:"", title:"State FIPS", editable:false, type:"number"},
    {colId:"", title:"In-State County Code", editable:false, type:"number"}
  ];

  fileName: string;
  heading: string;
  isTableEditable: boolean;
  usePaging: boolean;
  rowCount: number;
  noHeading: boolean;

  constructor(private runDataService: RunDataService, private configService: SystemConfigService) {
    super(<any[]>runDataService.runData.countyFips);

    this.heading = "County Data";
    this.fileName = configService.fileName('CountyData');
    this.isTableEditable = false;
    this.usePaging = true;
    this.rowCount = -1;
    this.noHeading = false;
    this.relateAttributes(this.attributes);
  }

  //  We have to rebuild the table data.
  setJsonData(json) {
    this.runDataService.runData.countyFips = json;
    this.relateAttributes(this.attributes);
    this.dataSource = new MatTableDataSource([...json]);
  }
}
