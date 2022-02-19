import {MatTableDataSource} from "@angular/material/table";

export interface IFieldAttributes {
  colId: string;      // a unique column ID. (usually what is defined in the incoming data)
  title: string;      // what to display as a column heading
  editable: boolean;  // if the table is editable, is this field editable.
  type: string;       // the type of data.  There are 3 ( 'text', 'number', 'exponent')
}

export interface IJsonTableData {
  schema: string[] ;          // list of columns
  dataSource: MatTableDataSource<any>;  // the Material data source
  fieldAttributes: any[];     // List of field attributes to define columns
  heading: string;            // The header to display with the table
  isTableEditable: boolean;   // whether the table should be editable
  fileName: string;           // file name of the source data file
  usePaging: boolean;         // whether to use a paged display when displaying
  jsonData: any[];            // the JSON data associated with the table
  rowCount: number;           // the number of rows to display (-1 if just meant to fill the page)
  noHeading: boolean;         // whether the table had headings defined

  setJsonData(json:any[]);
}
