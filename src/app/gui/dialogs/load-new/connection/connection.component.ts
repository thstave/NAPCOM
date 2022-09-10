import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SystemConfigService} from "../../../../service/system-config.service";
import {ScriptReturn, ScriptService} from "../../../../electron/services";
import {RunScript} from "../../../../electron/services/run-script";

@Component({
    selector: 'app-connection',
    templateUrl: './connection.component.html',
    styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {
    @ViewChild('liveupdate') private liveUpdateElement: ElementRef;

    @Input() reload: Observable<void>;
    connectForm: FormGroup;

    private reloadSubscription: Subscription;
    private runScript: RunScript = undefined;

    constructor(private sysSvc: SystemConfigService,
                private fb: FormBuilder,
                private scriptService: ScriptService) {
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
            anlPwd: [this.sysSvc.appConfigData.anlPwd, [required]],
            liveResults: ["\n", []],

        });
    }

    checkConnection() {
        console.log('Saving first...')
        this.save()

        const command = "'" + <string>this.sysSvc.appConfigData.pythonCmd + "'";

        const args: string[] = [];
        args.push("'" + `${<string>this.sysSvc.appConfigData.localNapcomDir}/${<string>this.sysSvc.appConfigData.checkConnectionCmd}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlHost}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlUser}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlNodeCluster}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlPwd}` + "'");

        console.log(command + " " + args)

        this.connectForm.patchValue({liveResults: "Please Wait ....\n"});
        this.keepAtBottom();

        // this.connectForm.patchValue({
        //     liveResults: "--> Check Connection:" +
        //         " '" + `${<string>this.sysSvc.appConfigData.anlHost}` + "' " +
        //         "'" + `${<string>this.sysSvc.appConfigData.anlUser}` + "'"
        // });

        this.runnolive(command, args);
    }

    runnolive(command: string, args: any[]) {

        // Create a new instance of the run script
        this.runScript = this.scriptService.create();
        this.runScript.runNoLive(command, args, (dat: string) => {

            // Callback updates live results
            const patchVal = <string>this.connectForm.value["liveResults"] + dat;
            this.connectForm.patchValue({liveResults: patchVal});
            this.keepAtBottom();

        }).then((dat: ScriptReturn) => {

            // Valid completion displays the results
            this.connectForm.patchValue({results: dat.data});
            this.connectForm.patchValue({code: dat.code});

        }).catch(err => {

            // Error displays the returned error
            this.connectForm.patchValue({results: err});
            this.connectForm.patchValue({code: ""});

        });
    }

    keepAtBottom()
        :
        void {
        try {
            this.liveUpdateElement.nativeElement.scrollTop = this.liveUpdateElement.nativeElement.scrollHeight;
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Called to store the data.  Returns a promise.
     */
    save() {
        return new Promise((resolve) => {
            this.sysSvc.appConfigData.anlHost = this.connectForm.value["anlHost"];
            this.sysSvc.appConfigData.anlUser = this.connectForm.value["anlUser"];
            this.sysSvc.appConfigData.anlNodeCluster = this.connectForm.value["anlNodeCluster"];
            this.sysSvc.appConfigData.anlPwd = this.connectForm.value["anlPwd"];
            resolve({});
        });
    }
}
