import {MatTableDataSource} from "@angular/material/table";
import {IFieldAttributes, IJsonTableData} from "./i-json-table-data";

export abstract class AbstractJsonTableData  implements IJsonTableData {

  private editColumnAttributes : IFieldAttributes = {colId:"editColumnAttributes", title:"", editable:false, type:"edit"};
  fieldAttributes: IFieldAttributes[];
  dataSource: MatTableDataSource<any>;
  schema: string[];
  jsonData: any[];

  abstract fileName: string;
  abstract heading: string;
  abstract isTableEditable: boolean;
  abstract usePaging: boolean;
  abstract rowCount: number;
  abstract noHeading: boolean;

  constructor(jsonData: any[]) {
    this.initialize(jsonData);
  }

  protected initialize(jsonData:any[]) {
    this.jsonData = jsonData;
    // extract titles from first record. We are using JSON titles as our identifiers.
    this.schema = Object.keys(jsonData[0]);
    this.dataSource = new MatTableDataSource([...jsonData]);
  }

  protected relateAttributes(attributes: IFieldAttributes[]){
    this.fieldAttributes = attributes;
    // Add the title name to the field attributes colId
    let i = 0 ;
    this.schema.forEach( name => {
      this.fieldAttributes[i++].colId = name;
    });

    this.schema.unshift("editColumnAttributes");
    this.fieldAttributes.unshift(this.editColumnAttributes);
  }

  abstract setJsonData(json: any[]);

}
