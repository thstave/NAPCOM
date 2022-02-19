
### Tables.
All tables are located in the `src/app/gui/tables` path, extend `AbstractJsonTableData`, and implement `IJsonTableData`. When defining a table you need to define

All tables are displayed using a single Angular component, ```JsonTableComponent```.  This component uses the fields defined in IJsonTableData' to determine how to display a table.

```JsonTableComponent``` contains the following:
```
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
```

By changing the parameters when building your table you can change how the table is displayed.

For example, using the code for the base-modulus table:

```
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
```

In the above code:
- 'attributes' - defines each column of the table. NOTE: 'colId' is left blank and is filled in by the column specified in the CSV.
- 'constructor' - sets the parameters for the table.
- 'setJsonData' - is used to provide new data to the table.
