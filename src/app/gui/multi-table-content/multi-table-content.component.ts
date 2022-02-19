import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {IJsonTableData} from "../tables/i-json-table-data";
import {JsonInputService, SystemAccessService} from "../../electron/services";
import {Subject} from "rxjs";
import {SystemConfigService} from "../../service/system-config.service";

function ngAfterContentInit() {

}

@Component({
  selector: 'app-multi-table-content',
  templateUrl: './multi-table-content.component.html',
  styleUrls: ['./multi-table-content.component.scss']
})
export class MultiTableContentComponent implements OnInit {

  @ViewChild('multi-table-content-wrapper') tableDiv: ElementRef;
  @Input() tables : IJsonTableData[];
  @Input() heading : string;
  tableRefreshSubject: Subject<string> = new Subject<string>();
  private _tableCnt = 0;
  maxTableHeight: number;

  constructor(private systemAccessService :SystemAccessService,
              private systemConfigService : SystemConfigService,
              private jsonSvc: JsonInputService) { }

  ngOnInit(): void {
    this._tableCnt = this.tables.length;
    console.log(`table size ${this.tables.length}`);
  }

  ngAfterViewInit() {
    this.maxTableHeight = this.tableDiv.nativeElement.offsetHeight;
  }

  tableFileName(pos:number) : string {
    return this.tables[pos].fileName;
  }

  table(pos:number) : IJsonTableData {
    return this.tables[pos];
  }

  get tableCnt(): number {
    return this._tableCnt;
  }

  open(pos:number) {
    this.systemAccessService.openInApplication(this.systemConfigService.workingDirectory, this.table(pos).fileName);
  }

  reload(pos:number) {
    this.jsonSvc.csvAsJsonNoHeader(`${this.systemConfigService.workingDirectory}/${this.table(pos).fileName}`)
      .then( json => {
        this.table(pos).setJsonData(json);
        this.tableRefreshSubject.next(this.table(pos).fileName);
      });
  }
}
