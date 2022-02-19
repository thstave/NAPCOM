import {RunDataService} from "../../service/run-data.service";
import {AbstractJsonTableData} from "./abstract-json-table-data";
import {SystemConfigService} from "../../service/system-config.service";

export class HpmsTable extends AbstractJsonTableData {

  fileName: string;
  heading: string;
  isTableEditable: boolean;
  usePaging: boolean;
  rowCount: number;
  noHeading: boolean;

  constructor(private runDataService: RunDataService, private configService: SystemConfigService) {
    super(<any[]>runDataService.runData.hpms);

    this.heading = "HPMS Data";
    this.fileName = configService.fileName('HPMSData');
    this.isTableEditable = true;
    this.usePaging = true;
    this.rowCount = 15;
    this.noHeading = false;
    this.buildAttributes();
  }

  protected buildAttributes(){
    this.fieldAttributes = [];
    let i = 0 ;
    this.schema.forEach( entry => {
      if ( [5,6,51].includes(i++)) {
        this.fieldAttributes.push({colId:entry, title:entry, editable:false, type:"text"});
      } else {
        this.fieldAttributes.push({colId:entry, title:entry, editable:false, type:"number"});
      }
    });
  }

  //  We have to rebuild the table data.
  setJsonData(json) {
    this.runDataService.runData.subgradeModulus = json;
    this.initialize(<any[]>this.runDataService.runData.subgradeModulus);
    this.buildAttributes();
  }
}
