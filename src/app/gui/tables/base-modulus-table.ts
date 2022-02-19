import {IFieldAttributes, IJsonTableData} from "./i-json-table-data";
import {RunDataService} from "../../service/run-data.service";
import {AbstractJsonTableData} from "./abstract-json-table-data";
import {SystemConfigService} from "../../service/system-config.service";

export class BaseModulusTable extends AbstractJsonTableData {

  private attributes : IFieldAttributes[] = [
    {colId:"", title:"", editable:false, type:"number"},
    {colId:"", title:"Base Type", editable:true, type:"number"},
    {colId:"", title:"Description", editable:true, type:"text"},
    {colId:"", title:"Modulus PSI", editable:false, type:"number"},
    {colId:"", title:"Notes", editable:false, type:"text"}
  ];

  fileName: string;
  heading: string;
  isTableEditable: boolean;
  usePaging: boolean;
  rowCount: number;
  noHeading:boolean;

  constructor(private runDataService: RunDataService, private configService: SystemConfigService) {
    super(<any[]>runDataService.runData.baseModulus);

    this.heading = "Base Defaults";
    this.fileName = configService.fileName('BaseDefaults');
    this.isTableEditable = true;
    this.usePaging = false;
    this.rowCount = -1;
    this.noHeading = false;
    this.relateAttributes(this.attributes);
  }

  //  We have to rebuild the table data.
  setJsonData(json) {
    this.runDataService.runData.baseModulus = json;
    this.initialize(<any[]>this.runDataService.runData.baseModulus);
    this.relateAttributes(this.attributes);
  }
}
