import {RunDataService} from "../../service/run-data.service";
import {AbstractJsonTableData} from "./abstract-json-table-data";
import {SystemConfigService} from "../../service/system-config.service";
import {MatTableDataSource} from "@angular/material/table";

export class AxleloadTrTable extends AbstractJsonTableData {

  fileName: string;
  heading: string;
  isTableEditable: boolean;
  usePaging: boolean;
  rowCount: number;
  noHeading: boolean;

  constructor(private runDataService: RunDataService, private configService: SystemConfigService) {
    super(<any[]>runDataService.runData.axleLoadTr);

    this.heading = "";
    this.fileName = configService.fileName('AxleLoadTr');
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
    this.runDataService.runData.axleLoadTr = json;
    this.buildAttributes();
    this.dataSource = new MatTableDataSource([...json]);
  }
}
