import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RunDataService} from "../../../service/run-data.service";
import {DataFileConfigComponent} from "./data-file-config/data-file-config.component";
import {AnalysisParamsComponent} from "./analysis-params/analysis-params.component";
import {SystemAccessService} from "../../../electron/services";
import {SystemConfigService} from "../../../service/system-config.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-load-new',
  templateUrl: './load-new.component.html',
  styleUrls: ['./load-new.component.scss']
})
export class LoadNewComponent implements OnInit {
  @ViewChild(DataFileConfigComponent) dataComponent: DataFileConfigComponent;
  @ViewChild(AnalysisParamsComponent) analysisComponent: AnalysisParamsComponent;

  reloadSubject: Subject<void> = new Subject<void>();
  displayDirectory : string ;

  constructor(
    private runSvc: RunDataService,
    private sysAccessService: SystemAccessService,
    private systemConfigService: SystemConfigService,
    private dialogRef: MatDialogRef<LoadNewComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
  }

  ngOnInit() {
    this.displayDirectory = this.systemConfigService.workingDirectory;
  }

  /**
   * Called when the submit button is pressed.  Initiates the
   * file reads and on successful completion, stores the data in the
   * Run Service than exits.
   */
  save() {
    this.analysisComponent.save().then(obj => {
      this.systemConfigService.workingDirectory = this.displayDirectory;
      return this.dataComponent.save();
    }).then( fileData => {
      this.runSvc.runData = fileData;
      return this.systemConfigService.writeConfigData();
    }).then( obj => {
      this.dialogRef.close();
    }).catch(err => {
      console.log(err);
    });
  }

  /**
   * Close the dialog without saving any data.
   */
  close() {
    this.dialogRef.close();
  }

  onDirectoryChange(event) {
    this.systemConfigService.workingDirectory = this.displayDirectory;
    this.systemConfigService.readConfigData().then(() => {
      this.reloadSubject.next();
    });

  }

  directory() {
    const folder = this.systemConfigService.workingDirectory;
    console.log(folder);
    this.sysAccessService.browse(folder).then ( path => {
      if (!(path.canceled || path.filePaths.length === 0)){
        this.systemConfigService.workingDirectory = path.filePaths[0];
        this.displayDirectory = this.systemConfigService.workingDirectory;
        this.systemConfigService.readConfigData().then(() => {
          this.reloadSubject.next();
        });
      }
    });
  }
}

