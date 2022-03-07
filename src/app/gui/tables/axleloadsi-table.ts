import {IFieldAttributes} from "./i-json-table-data";
import {RunDataService} from "../../service/run-data.service";
import {AbstractJsonTableData} from "./abstract-json-table-data";
import {SystemConfigService} from "../../service/system-config.service";
import {MatTableDataSource} from "@angular/material/table";

export class AxleloadSiTable extends AbstractJsonTableData {

  fileName: string;
  heading: string;
  isTableEditable: boolean;
  usePaging: boolean;
  rowCount: number;
  noHeading: boolean;

  constructor(private runDataService: RunDataService, private configService: SystemConfigService) {
    super(<any[]>runDataService.runData.axleLoadSi);

    this.heading = "";
    this.fileName = configService.fileName('AxleLoadSi');
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
    this.runDataService.runData.axleLoadSi = json;
    this.buildAttributes();
    this.dataSource = new MatTableDataSource([...json]);
  }
}

