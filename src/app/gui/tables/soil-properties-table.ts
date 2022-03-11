import {IFieldAttributes} from "./i-json-table-data";
import {RunDataService} from "../../service/run-data.service";
import {AbstractJsonTableData} from "./abstract-json-table-data";
import {SystemConfigService} from "../../service/system-config.service";
import {MatTableDataSource} from "@angular/material/table";

export class SoilPropertiesTable extends AbstractJsonTableData {

  private attributes : IFieldAttributes[] = [
    {colId:"", title:"", editable:false, type:"number"},
    {colId:"", title:"State FIPS Code", editable:true, type:"number"},
    {colId:"", title:"HPMS Soil Type", editable:true, type:"number"},
    {colId:"", title:"Sand Fraction Percent", editable:true, type:"number"},
    {colId:"", title:"Silt Fraction Percent", editable:true, type:"number"},
    {colId:"", title:"Clay Fraction Percent", editable:true, type:"number"},
    {colId:"", title:"Plasticity Index Percent", editable:true, type:"number"},
    {colId:"", title:"Sand Silt Clay Percent", editable:true, type:"number"},
    {colId:"", title:"Gravel Fraction Percent", editable:true, type:"number"},
  ];

  fileName: string;
  heading: string;
  isTableEditable: boolean;
  usePaging: boolean;
  rowCount: number;
  noHeading: boolean;

  constructor(private runDataService: RunDataService, private configService: SystemConfigService) {
    super(<any[]>runDataService.runData.soilProperties);

    this.heading = "Soil Properties";
    this.fileName = configService.fileName('SoilProperties');
    this.isTableEditable = false;
    this.usePaging = false;
    this.rowCount = 6;
    this.noHeading = false;
    this.relateAttributes(this.attributes);
  }

  //  We have to rebuild the table data.
  setJsonData(json) {
    this.jsonData = json;
    this.runDataService.runData.soilProperties = json;
    this.relateAttributes(this.attributes);
    this.dataSource = new MatTableDataSource([...json]);
  }
}
