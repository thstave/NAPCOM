import {IFieldAttributes, IJsonTableData} from "./i-json-table-data";
import {RunDataService} from "../../service/run-data.service";
import {AbstractJsonTableData} from "./abstract-json-table-data";
import {SystemConfigService} from "../../service/system-config.service";

export class AxleConfigurationTable extends AbstractJsonTableData {

  private attributes : IFieldAttributes[] = [
    {colId:"", title:"", editable:false, type:"number"},
    {colId:"", title:"NAPCOM2012 Class", editable:false, type:"text"},
    {colId:"", title:"NAPCOM2012 Class Name", editable:false, type:"text"},
    {colId:"", title:"FHWA13 Class", editable:false, type:"number"},
    {colId:"", title:"HCAS2017 Class", editable:false, type:"number"},
    {colId:"", title:"HCAS2017 Class Name", editable:false, type:"text"},
    {colId:"", title:"Num Single", editable:false, type:"number"},
    {colId:"", title:"Num Tandem", editable:false, type:"number"},
    {colId:"", title:"Num Tridem", editable:false, type:"number"},
    {colId:"", title:"Num Quad", editable:false, type:"number"},
    {colId:"", title:"Single or Comb", editable:false, type:"number"},
    {colId:"", title:"% National Avg", editable:false, type:"number"},
    {colId:"", title:"% SU", editable:false, type:"number"},
    {colId:"", title:"% CU", editable:true, type:"number"},
    {colId:"", title:"% SUCU", editable:true, type:"number"},
    {colId:"", title:"% National Avg Trucks", editable:false, type:"number"},
    {colId:"", title:"% SUT", editable:false, type:"number"},
    {colId:"", title:"% CUT", editable:false, type:"number"},
    {colId:"", title:"% SUCUT", editable:false, type:"number"},
  ];

  fileName: string;
  heading: string;
  isTableEditable: boolean;
  usePaging: boolean;
  rowCount: number;
  noHeading:boolean;

  constructor(private runDataService: RunDataService, private configService: SystemConfigService) {
    super(<any[]>runDataService.runData.axleConfig);

    this.heading = "Axle Configuration";
    this.fileName = configService.fileName('AxleConfiguration');
    this.isTableEditable = false;
    this.usePaging = false;
    this.rowCount = -1;
    this.noHeading = false;
    this.relateAttributes(this.attributes);
  }

  //  We have to rebuild the table data.
  setJsonData(json) {
    this.runDataService.runData.axleConfig = json;
    this.initialize(<any[]>this.runDataService.runData.axleConfig);
    this.relateAttributes(this.attributes);
  }
}
