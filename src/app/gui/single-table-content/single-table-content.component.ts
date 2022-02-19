import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {IJsonTableData} from "../tables/i-json-table-data";
import {JsonInputService, SystemAccessService} from "../../electron/services";
import {Observable, Subject, Subscription} from "rxjs";
import {SystemConfigService} from "../../service/system-config.service";

@Component({
  selector: 'app-single-table-content',
  templateUrl: './single-table-content.component.html',
  styleUrls: ['./single-table-content.component.scss']
})
export class SingleTableContentComponent implements OnInit {

  @ViewChild('singleTableContentWrapper') tableDiv: ElementRef;
  @Input('table') _table : IJsonTableData;

  tableRefreshSubject: Subject<string> = new Subject<string>();
  maxTableHeight: number;

  constructor(private systemAccessService :SystemAccessService,
              private systemConfigService: SystemConfigService,
              private jsonSvc: JsonInputService) { }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.maxTableHeight = this.tableDiv.nativeElement.offsetHeight;
  }

  get heading() : string {
    return this._table.heading;
  }

  get fileName() : string {
    return this._table.fileName;
  }

  get table() : IJsonTableData {
    return this._table;
  }

  open() {
    this.systemAccessService.openInApplication(this.systemConfigService.workingDirectory, this.table.fileName);
  }

  reload() {
    this.jsonSvc.csvAsJsonNoHeader(this.systemConfigService.workingDirectory + this.table.fileName)
      .then( json => {
        this.table.setJsonData(json);
        // Trigger data refresh
        this.tableRefreshSubject.next(this.table.fileName);
      });
  }
}
