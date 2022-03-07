import {Component, Input, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SystemConfigService} from "../../../../service/system-config.service";

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

  @Input() reload: Observable<void>;
  connectForm: FormGroup;
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

    this.connectForm = this.fb.group({
      anlHost: [this.sysSvc.appConfigData.anlHost, [required]],
      anlUser: [this.sysSvc.appConfigData.anlUser, [required]],
      anlNodeCluster: [this.sysSvc.appConfigData.anlNodeCluster, [required]],
      anlPwd: [this.sysSvc.appConfigData.anlPwd, [required]]
    });
  }

  /**
   * Called to store the data.  Returns a promise.
   */
  save() {
    return new Promise( (resolve) => {
      this.sysSvc.appConfigData.anlHost = this.connectForm.value["anlHost"];
      this.sysSvc.appConfigData.anlUser = this.connectForm.value["anlUser"];
      this.sysSvc.appConfigData.anlNodeCluster = this.connectForm.value["anlNodeCluster"];
      this.sysSvc.appConfigData.anlPwd = this.connectForm.value["anlPwd"];
      resolve({});
    });
  }
}
