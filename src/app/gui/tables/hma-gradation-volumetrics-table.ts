import {IFieldAttributes} from "./i-json-table-data";
import {RunDataService} from "../../service/run-data.service";
import {AbstractJsonTableData} from "./abstract-json-table-data";
import {SystemConfigService} from "../../service/system-config.service";
import {MatTableDataSource} from "@angular/material/table";

export class HmaGradationVolumetricsTable extends AbstractJsonTableData {

  private attributes : IFieldAttributes[] = [
    {colId:"", title:"", editable:false, type:"number"},
    {colId:"", title:"State FIPS Code", editable:true, type:"number"},
    {colId:"", title:"% Pass 34in", editable:true, type:"number"},
    {colId:"", title:"% Pass 38in", editable:true, type:"number"},
    {colId:"", title:"% Pass No 4", editable:true, type:"number"},
    {colId:"", title:"% Pass No 80", editable:true, type:"number"},
    {colId:"", title:"% Pass No 200", editable:true, type:"number"},
    {colId:"", title:"HMA Air Voids %", editable:true, type:"number"},
    {colId:"", title:"HMA Binder Content by Volume %", editable:true, type:"number"},
  ];

  fileName: string;
  heading: string;
  isTableEditable: boolean;
  usePaging: boolean;
  rowCount: number;
  noHeading: boolean;

  constructor(private runDataService: RunDataService, private configService: SystemConfigService) {
    super(<any[]>runDataService.runData.hmaGradation);

    this.heading = "HMA Gradation Volumetrics";
    this.fileName = configService.fileName('HMAGradation');
    this.isTableEditable = false;
    this.usePaging = false;
    this.rowCount = 8;
    this.noHeading = false;
    this.relateAttributes(this.attributes);
  }

  //  We have to rebuild the table data.
  setJsonData(json) {
    this.jsonData = json;
    this.runDataService.runData.hmaGradation = json;
    this.relateAttributes(this.attributes);
    this.dataSource = new MatTableDataSource([...json]);
  }
}
