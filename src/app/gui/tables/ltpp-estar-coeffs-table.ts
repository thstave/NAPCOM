import {IFieldAttributes} from "./i-json-table-data";
import {RunDataService} from "../../service/run-data.service";
import {AbstractJsonTableData} from "./abstract-json-table-data";
import {SystemConfigService} from "../../service/system-config.service";
import {MatTableDataSource} from "@angular/material/table";

export class LtppEstarCoeffsTable extends AbstractJsonTableData {

  private attributes : IFieldAttributes[] = [
    {colId:"", title:"", editable:false, type:"number"},
    {colId:"", title:"State Code", editable:false, type:"number"},
    {colId:"", title:"State Name", editable:false, type:"text"},
    {colId:"", title:"SHRPID", editable:false, type:"text"},
    {colId:"", title:"LAT", editable:false, type:"number"},
    {colId:"", title:"LONG", editable:false, type:"number"},
    {colId:"", title:"Layer #", editable:false, type:"number"},
    {colId:"", title:"Layer Thick", editable:false, type:"number"},
    {colId:"", title:"Estar Coeff 1", editable:false, type:"number"},
    {colId:"", title:"Estar Coeff 2", editable:false, type:"number"},
    {colId:"", title:"Estar Coeff 3", editable:false, type:"number"},
    {colId:"", title:"Estar Coeff 4", editable:false, type:"number"},
    {colId:"", title:"Shift Coeff 1", editable:false, type:"number"},
    {colId:"", title:"Shift Coeff 2", editable:false, type:"number"},
    {colId:"", title:"Shift Coeff 3", editable:false, type:"number"},
    {colId:"", title:"Tref", editable:false, type:"number"},
  ];

  fileName: string;
  heading: string;
  isTableEditable: boolean;
  usePaging: boolean;
  rowCount: number;
  noHeading: boolean;

  constructor(private runDataService: RunDataService, private configService: SystemConfigService) {
    super(<any[]>runDataService.runData.estarCoeffs);

    this.heading = "LTPP Estar Coeffs";
    this.fileName = configService.fileName('EstarCoeffs');
    this.isTableEditable = false;
    this.usePaging = true;
    this.rowCount = 6;
    this.noHeading = false;
    this.relateAttributes(this.attributes);
  }

  //  We have to rebuild the table data.
  setJsonData(json) {
    this.jsonData = json;
    this.runDataService.runData.estarCoeffs = json;
    this.relateAttributes(this.attributes);
    this.dataSource = new MatTableDataSource([...json]);
  }
}
