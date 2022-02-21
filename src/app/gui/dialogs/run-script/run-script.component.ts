import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ScriptReturn, ScriptService} from "../../../electron/services";

@Component({
  selector: 'app-run-script',
  templateUrl: './run-script.component.html',
  styleUrls: ['./run-script.component.scss']
})
export class RunScriptComponent implements OnInit {
  runForm: FormGroup;
  anlForm: FormGroup;

  constructor(private fb: FormBuilder,
              private scriptService: ScriptService) {
  }

  ngOnInit() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const required = Validators.required;

    // Configures the form group, sets the default values, and makes each file required.
    this.runForm = this.fb.group({
      command: ["", [required]],
      args: ["", []],
      results: ["", []],
      code: ["",[]]
    });

    this.anlForm = this.fb.group({
      ANLHost: ["login1.arrow.tracc.anl.gov", [required]],
      anl_user: ["ac.mkutay", [required]],
      ANLNodeCluster: ["batch", [required]],
      ANLpwd: ["Ne?Sifre2021Ama", [required]],
      localNAPCOMfld: ["/Users/kutay/My Drive/_Docs/My Algorithms/_UPDAPS2Codes/_NAPCOMPlus/Deploy/", [required]],
      remoteNAPCOMfld: ["/mnt/lustre/arrow/home/ac.mkutay/updapscodes/napcomplus/", [required]],
      ext: ["*.py", [required]],
      PythonEnv: ["/usr/local/opt/python@3.8/bin/python3", [required]],
      NAPCOMDataDir: ["/Users/kutay/My Drive/_Docs/My Algorithms/_UPDAPS2Codes/_NAPCOMPlus/Deploy/io/", [required]],
      localUPDAPSACfld: ["/Users/kutay/My Drive/_Docs/My Algorithms/_UPDAPS2Codes/PythonCode_VECD_4Calibration", [required]],
      remoteUPDAPSACfld: ["/mnt/lustre/arrow/home/ac.mkutay/updapscodes/updapsac_vecd_3pt/", [required]],
      ext2: ["*.py, *.pkl, *.xlsx", [required]],
    });
  }

  /**
   * Called to store the data.  Returns a promise.
   */
  run() {
    const args = (this.runForm.value["args"] != null && this.runForm.value["args"].length > 0)
      ? this.runForm.value["args"].split(",")
      : [];
    this.scriptService.runScript(this.runForm.value["command"], args)
      .then((dat: ScriptReturn) => {
        this.runForm.patchValue({results: dat.data});
        this.runForm.patchValue({code: dat.code});
      }).catch(err => {
        this.runForm.patchValue({results: err});
        this.runForm.patchValue({code: ""});
      });
  }


  /**
   * Called to store the data.  Returns a promise.
   */
  uploadnapcomfiles() {
    const command = this.anlForm.value["PythonEnv"] +
        " '" + this.anlForm.value["localNAPCOMfld"] + "/sendNAPCOMfiles.py' '" +
        this.anlForm.value["ANLHost"] + "' '" +
        this.anlForm.value["anl_user"] + "' '" +
        this.anlForm.value["ANLNodeCluster"] + "' '" +
        this.anlForm.value["ANLpwd"] + "' '" +
        this.anlForm.value["localNAPCOMfld"] + "' '" +
        this.anlForm.value["remoteNAPCOMfld"] + "' '" +
        this.anlForm.value["ext"] + "' '" +
        this.anlForm.value["NAPCOMDataDir"] + "'"

    // console.log(command)
    this.scriptService.runScript2(command)
        .then((dat: ScriptReturn) => {
          this.runForm.patchValue({results: dat.data});
          this.runForm.patchValue({code: dat.code});
        }).catch(err => {
      this.runForm.patchValue({results: err});
      this.runForm.patchValue({code: ""});
    });
  }



  /**
   * Called to store the data.  Returns a promise.
   */
  uploadupdapsfiles() {
    const command = this.anlForm.value["PythonEnv"] +
        " '" + this.anlForm.value["localNAPCOMfld"] + "/sendUPDAPSfiles.py' '" +
        this.anlForm.value["ANLHost"] + "' '" +
        this.anlForm.value["anl_user"] + "' '" +
        this.anlForm.value["ANLNodeCluster"] + "' '" +
        this.anlForm.value["ANLpwd"] + "' '" +
        this.anlForm.value["localUPDAPSACfld"] + "' '" +
        this.anlForm.value["remoteUPDAPSACfld"] + "' '" +
        this.anlForm.value["ext2"] + "'"

    // console.log(command)
    this.scriptService.runScript2(command)
        .then((dat: ScriptReturn) => {
          this.runForm.patchValue({results: dat.data});
          this.runForm.patchValue({code: dat.code});
        }).catch(err => {
      this.runForm.patchValue({results: err});
      this.runForm.patchValue({code: ""});
    });
  }



  /**
   * Called to store the data.  Returns a promise.
   */
  checkconnection() {
    const command = this.anlForm.value["PythonEnv"] +
        " '" + this.anlForm.value["localNAPCOMfld"] + "/checkconnection.py' '" +
        this.anlForm.value["ANLHost"] + "' '" +
        this.anlForm.value["anl_user"] + "' '" +
        this.anlForm.value["ANLNodeCluster"] + "' '" +
        this.anlForm.value["ANLpwd"] + "'"

    // console.log(command)
    this.scriptService.runScript2(command)
        .then((dat: ScriptReturn) => {
          this.runForm.patchValue({results: dat.data});
          this.runForm.patchValue({code: dat.code});
        }).catch(err => {
      this.runForm.patchValue({results: err});
      this.runForm.patchValue({code: ""});
    });
  }




}
