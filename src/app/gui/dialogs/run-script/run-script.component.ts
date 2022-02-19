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

}
