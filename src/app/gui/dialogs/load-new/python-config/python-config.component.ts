import {Component, Input, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SystemConfigService} from "../../../../service/system-config.service";

@Component({
  selector: 'app-python-config',
  templateUrl: './python-config.component.html',
  styleUrls: ['./python-config.component.scss']
})
export class PythonConfigComponent implements OnInit {

  @Input() reload: Observable<void>;
  pythonForm: FormGroup;
  private reloadSubscription: Subscription;

  constructor( private sysSvc: SystemConfigService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.reloadSubscription = this.reload.subscribe(() => this.initializeForm());
    this.initializeForm();
  }

  initializeForm() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const required = Validators.required;

    // Configures the form group, sets the default values, and makes each file required.
    this.pythonForm = this.fb.group({
      pythonCmd: [this.sysSvc.appConfigData.pythonCmd, [required]],
      jobSubmitCmd: [this.sysSvc.appConfigData.jobSubmitCmd, [required]],
      sendNapcomCmd: [this.sysSvc.appConfigData.sendNapcomCmd, [required]],
      localNapcomDir: [this.sysSvc.appConfigData.localNapcomDir, [required]],
      remoteNapcomDir: [this.sysSvc.appConfigData.remoteNapcomDir, [required]],
      sendUpdapsCmd: [this.sysSvc.appConfigData.sendUpdapsCmd, [required]],
      localUpdapsacDir: [this.sysSvc.appConfigData.localUpdapsacDir, [required]],
      remoteUpdapsacDir: [this.sysSvc.appConfigData.remoteUpdapsacDir, [required]],
      checkConnectionCmd: [this.sysSvc.appConfigData.checkConnectionCmd, [required]]
    });
  }

  /**
   * Called to store the data.  Returns a promise.
   */
  save() {
    return new Promise( (resolve) => {
      this.sysSvc.appConfigData.pythonCmd = this.pythonForm.value["pythonCmd"];
      this.sysSvc.appConfigData.jobSubmitCmd = this.pythonForm.value["jobSubmitCmd"];
      this.sysSvc.appConfigData.sendNapcomCmd = this.pythonForm.value["sendNapcomCmd"];
      this.sysSvc.appConfigData.localNapcomDir = this.pythonForm.value["localNapcomDir"];
      this.sysSvc.appConfigData.remoteNapcomDir = this.pythonForm.value["remoteNapcomDir"];
      this.sysSvc.appConfigData.sendUpdapsCmd = this.pythonForm.value["sendUpdapsCmd"];
      this.sysSvc.appConfigData.localUpdapsacDir = this.pythonForm.value["localUpdapsacDir"];
      this.sysSvc.appConfigData.remoteUpdapsacDir = this.pythonForm.value["remoteUpdapsacDir"];
      this.sysSvc.appConfigData.checkConnectionCmd = this.pythonForm.value["checkConnectionCmd"];

      resolve({});
    });
  }
}
