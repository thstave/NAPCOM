import {MatTableDataSource} from "@angular/material/table";
import {IFieldAttributes, IJsonTableData} from "./i-json-table-data";

export abstract class AbstractJsonTableData  implements IJsonTableData {

  private editColumnAttributes : IFieldAttributes = {colId:"editColumnAttributes", title:"", editable:false, type:"edit"};
  fieldAttributes: IFieldAttributes[];
  dataSource: MatTableDataSource<any>;
  schema: string[];
  jsonData: any[];

  abstract fileName: string;  // file name of the source data file
  abstract heading: string;   // The header to display with the table
  abstract isTableEditable: boolean; // whether the table should be editable
  abstract usePaging: boolean;  // whether to use a paged display when displaying
  abstract rowCount: number;    // the number of rows to display (-1 if just meant to fill the page)
  abstract noHeading: boolean;  // whether the table had headings defined

  constructor(jsonData: any[]) {
    this.initialize(jsonData);
  }

  protected initialize(jsonData:any[]) {
    console.log("intialization");
    this.jsonData = jsonData;
    // extract titles from first record. We are using JSON titles as our identifiers.
    this.schema = Object.keys(jsonData[0]);
    this.dataSource = new MatTableDataSource([...jsonData]);
  }

  protected relateAttributes(attributes: IFieldAttributes[]){
    console.log("relateAttributes");
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
