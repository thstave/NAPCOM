import {RunDataService} from "../../service/run-data.service";
import {AbstractJsonTableData} from "./abstract-json-table-data";
import {SystemConfigService} from "../../service/system-config.service";


export class AxleloadTaTable extends AbstractJsonTableData {

  fileName: string;
  heading: string;
  isTableEditable: boolean;
  usePaging: boolean;
  rowCount: number;
  noHeading: boolean;

  constructor(private runDataService: RunDataService, private configService: SystemConfigService) {
    super(<any[]>runDataService.runData.axleLoadTa);

    this.heading = "";
    this.fileName = configService.fileName('AxleLoadTa');
    this.isTableEditable = false;
    this.usePaging = true;
    this.rowCount = 5;
    this.noHeading = true;
    this.buildAttributes();
  }

  protected buildAttributes() {
    this.fieldAttributes = [];
    let i = 0 ;
    this.schema.forEach( entry => {
      this.fieldAttributes.push({colId:entry, title:entry, editable:false, type:"exponent"});
      i++;
    });
  }

  //  We have to rebuild the table data.
  setJsonData(json) {
    this.runDataService.runData.axleLoadTa = json;
    this.initialize(<any[]>this.runDataService.runData.axleLoadTa);
    this.buildAttributes();
  }
}
