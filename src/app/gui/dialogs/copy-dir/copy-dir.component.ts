import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SystemAccessService} from "../../../electron/services";
import {SystemConfigService} from "../../../service/system-config.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-copy-dir',
  templateUrl: './copy-dir.component.html',
  styleUrls: ['./copy-dir.component.scss']
})
export class CopyDirComponent implements OnInit {
  copyForm: FormGroup;
  displayDirectory : string ;

  constructor(
    private fb: FormBuilder,
    private sysAccessService: SystemAccessService,
    private systemConfigService: SystemConfigService,
    private dialogRef: MatDialogRef<CopyDirComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
  }

  ngOnInit() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const required = Validators.required;
    // Configures the form group, sets the default values, and makes each file required.
    this.copyForm = this.fb.group({
      copyFrom: [this.systemConfigService.workingDirectory,[required]],
      copyTo: ["",[required]],
      loadFlag: [false,[]],
    });
  }

  /**
   * Called when the copy button is pressed.
   */
  copy() {
    this.sysAccessService.copyDir(<string>this.copyForm.value["copyFrom"],<string>this.copyForm.value["copyTo"])
      .then ( path => {
        if (this.copyForm.value["loadFlag"]){
          this.systemConfigService.workingDirectory = <string>this.copyForm.value["copyTo"];
        }
        this.dialogRef.close({loadFlag:this.copyForm.value["loadFlag"]});
      }).catch(err => {
        console.log(err);
      });
  }

  /**
   * Close the dialog without saving any data.
   */
  close() {
    this.dialogRef.close({loadFlag:false});
  }

  toDirectory() {
    const folder = this.systemConfigService.workingDirectory;
    console.log(folder);
    this.sysAccessService.browse(folder).then ( path => {
      console.dir(path);
      if (!(path.canceled || path.filePaths.length === 0)){
        console.log(path.filePaths[0]);
        this.copyForm.patchValue({'copyTo': path.filePaths[0]});
      }
    });
  }

  fromDirectory() {
    const folder = this.systemConfigService.workingDirectory;
    this.sysAccessService.browse(folder).then ( path => {
      console.dir(path);
      if (!(path.canceled || path.filePaths.length === 0)){
        console.log(path.filePaths[0]);
        this.copyForm.patchValue({'copyFrom': path.filePaths[0]});
      }
    });
  }
}

