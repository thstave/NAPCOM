import {MatTableDataSource} from "@angular/material/table";

export interface IFieldAttributes {
  colId: string;
  title: string;
  editable: boolean;
  type: string;
}

export interface IJsonTableData {
  schema: string[] ;
  dataSource: MatTableDataSource<any>;
  fieldAttributes: any[];
  heading: string;
  isTableEditable: boolean;
  fileName: string;
  usePaging: boolean;
  jsonData: any[];
  rowCount: number;
  noHeading: boolean;

  setJsonData(json:any[]);
}
