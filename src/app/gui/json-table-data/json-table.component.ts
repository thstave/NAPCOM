import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {IFieldAttributes, IJsonTableData} from "../tables/i-json-table-data";
import {MatPaginator} from "@angular/material/paginator";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-json-table',
  templateUrl: './json-table.component.html',
  styleUrls: ['./json-table.component.scss']
})
export class JsonTableComponent implements OnInit {

  @ViewChild(MatTable) matTable: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() maxTableHeight?: number = undefined;
  @Input() table : IJsonTableData;
  @Input() refreshEvent: Observable<string>;

  private refreshSubscription: Subscription;
  // take the div size and remove the top title and button size.
  private maxHeight = ( this.maxTableHeight !== undefined) ? this.maxTableHeight - 170 : 850;
  // header row height (57) scroll bar (20) borders margins (16)
  private nonRowHeight = 93;
  // row height
  private rowHeight = 48 ;
  // Paged bottom height
  private pagedBottomRowHeight = 56 ;

  private rowEditPosition = -1 ;

  displayedColumns: string[];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  attributes: IFieldAttributes[];
  usePaging: boolean;
  loading = true;
  pageSize = 15;  // default value will be replaced.
  tableEditable = false ;

  constructor() {}

  ngOnInit(): void {
    this.refreshSubscription = this.refreshEvent.subscribe((fileNm) => this.refresh(fileNm));
    this.displayedColumns = this.table.schema;
    this.attributes = this.table.fieldAttributes;
    this.usePaging = this.table.usePaging;
    this.tableEditable = this.table.isTableEditable;
    this.pageSize = this.calculatePageSize();
    if ( !this.usePaging) {
      this.dataSource.data = this.table.jsonData;
      this.loading = false;
    }
  }

  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    if ( this.usePaging) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.data = this.table.jsonData;
      this.loading = false;
    }
  }

  calculatePageSize() : number {
    if ( this.table.rowCount > -1) {
      return this.table.rowCount;
    }

    let maxHeight = this.maxHeight - this.nonRowHeight;
    if ( this.table.usePaging) {
      maxHeight -= this.pagedBottomRowHeight;
    }
    return Math.floor( maxHeight / this.rowHeight );
  }

  calculcatedHeight() : string {

    let height = 0;
    let maxHeight = this.maxHeight;

    if ( this.table.usePaging) {
      maxHeight -= this.pagedBottomRowHeight;
      height = (this.pageSize * this.rowHeight) + this.nonRowHeight ;
    } else if ( this.table.rowCount > -1 ) {
      height = (this.table.rowCount * this.rowHeight) + this.nonRowHeight ;
    } else {
      height = (this.dataSource.data.length * this.rowHeight) + this.nonRowHeight;
    }

    if ( height > maxHeight) {
      height = maxHeight;
    }

    return height.toString() + "px" ;
  }

  getAttribute(name: string): IFieldAttributes {
    return this.attributes.find(entry => entry.colId == name);
  }

  isEdit(pos: number) {
    return pos === this.rowEditPosition;
  }

  toggleEdit(pos: number) {
    if ( this.isEdit(pos)) {
      this.rowEditPosition = -1;
    } else {
      this.rowEditPosition = pos;
    }
  }

  scientificNotation(str: string) : string{
    return Number(str).toExponential(2);
  }

  pageCount() {
    return this.pageSize;
  }

  refresh(fileNm: string) {

    if (this.table.fileName === fileNm) {
      this.attributes = this.table.fieldAttributes;

      if ( this.usePaging) {
        this.dataSource.paginator = this.paginator;
      }
      console.log(this.table.jsonData);
      this.dataSource.data = this.table.jsonData;
    }
  }
}
