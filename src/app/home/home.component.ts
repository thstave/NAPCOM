import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {LoadNewComponent} from "../gui/dialogs/load-new/load-new.component";
import {CopyDirComponent} from "../gui/dialogs/copy-dir/copy-dir.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void { }

  openDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    this.dialog.open(LoadNewComponent, dialogConfig);
  }

  openCopyDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(CopyDirComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.dir(result);
      if (result.loadFlag) {
        this.openDialog();
      }
    });
  }

}
