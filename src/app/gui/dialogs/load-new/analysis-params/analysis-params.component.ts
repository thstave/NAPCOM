import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {SystemConfigService} from "../../../../service/system-config.service";

@Component({
    selector: 'app-analysis-params',
    templateUrl: './analysis-params.component.html',
    styleUrls: ['./analysis-params.component.scss']
})
export class AnalysisParamsComponent implements OnInit {
    @Input() reload: Observable<void>;
    loadForm: FormGroup;
    private reloadSubscription: Subscription;

    constructor(private sysSvc: SystemConfigService, private fb: FormBuilder) {
    }

    ngOnInit() {
        this.reloadSubscription = this.reload.subscribe(() => this.initializeForm());
        this.initializeForm();
    }

    initializeForm() {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const required = Validators.required;

        // Configures the form group, sets the default values, and makes each file required.
        this.loadForm = this.fb.group({
            period: [this.sysSvc.appConfigData.period, [required]],
            states: [this.sysSvc.appConfigData.states, [required]],
            highwayTypes: [this.sysSvc.appConfigData.highwayTypes, [required]],
            pavementTypes: [this.sysSvc.appConfigData.pavementTypes, [required]],
            fltstr: [this.sysSvc.appConfigData.fltstr, [required]],
            remotejsonfld: [this.sysSvc.appConfigData.remotejsonfld, [required]],
            maxNumberOfRuns: [this.sysSvc.appConfigData.maxNumberOfRuns, [required]]
        });
    }

    /**
     * Called to store the data.  Returns a promise.
     */
    save() {
        return new Promise((resolve) => {
            this.sysSvc.appConfigData.period = this.loadForm.value["period"];
            this.sysSvc.appConfigData.states = this.loadForm.value["states"];
            this.sysSvc.appConfigData.highwayTypes = this.loadForm.value["highwayTypes"];
            this.sysSvc.appConfigData.pavementTypes = this.loadForm.value["pavementTypes"];
            this.sysSvc.appConfigData.fltstr = this.loadForm.value["fltstr"];
            this.sysSvc.appConfigData.remotejsonfld = this.loadForm.value["remotejsonfld"];
            this.sysSvc.appConfigData.maxNumberOfRuns = this.loadForm.value["maxNumberOfRuns"];
            resolve({});
        });
    }
}

