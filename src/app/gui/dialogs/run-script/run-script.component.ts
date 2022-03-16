import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ScriptReturn, ScriptService} from "../../../electron/services";
import {RunScript} from "../../../electron/services/run-script";
import {SystemConfigService} from "../../../service/system-config.service";
import {DataFileConfigComponent} from "../load-new/data-file-config/data-file-config.component";

@Component({
    selector: 'app-run-script',
    templateUrl: './run-script.component.html',
    styleUrls: ['./run-script.component.scss']
})
export class RunScriptComponent implements OnInit {
    @ViewChild('liveupdate') private liveUpdateElement: ElementRef;
    runForm: FormGroup;
    anlForm: FormGroup;

    private runScript: RunScript = undefined;

    constructor(private fb: FormBuilder,
                private scriptService: ScriptService,
                private sysSvc: SystemConfigService) {
    }

    ngOnInit() {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const required = Validators.required;

        // Configures the form group, sets the default values, and makes each file required.
        this.runForm = this.fb.group({
            command: ["", [required]],
            args: ["", []],
            results: ["", []],
            code: ["", []],
            liveResults: ["\n", []]
        });
    }

    checkRun() {
        const command = "'" + <string>this.sysSvc.appConfigData.pythonCmd + "'";

        const args: string[] = [];
        args.push("'" + `${<string>this.sysSvc.appConfigData.localNapcomDir}/${<string>this.sysSvc.appConfigData.checkJOBSCmd}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlHost}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlUser}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlNodeCluster}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlPwd}` + "'");

        let cumentry = command;
        for (let entry of args) {
            cumentry = cumentry + " " + entry;
        }
        // console.log(cumentry)
        this.runForm.patchValue({
            results: "--> Checking  active runs: " +
                " '" + `${<string>this.sysSvc.appConfigData.anlHost}` + "' " +
                "'" + `${<string>this.sysSvc.appConfigData.anlUser}` + "'"
        });

        this.run(command, args);
    }

    cancelRun() {
        const command = "'" + <string>this.sysSvc.appConfigData.pythonCmd + "'";

        const args: string[] = [];
        args.push("'" + `${<string>this.sysSvc.appConfigData.localNapcomDir}/${<string>this.sysSvc.appConfigData.cancelJOBSCmd}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlHost}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlUser}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlNodeCluster}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlPwd}` + "'");

        // let cumentry = command;
        // for (let entry of args) {
        //     cumentry = cumentry + " " + entry;
        // }
        // console.log(cumentry)
        this.runForm.patchValue({results: "--> Cancel Run"});

        this.run(command, args);
    }

    submitRun() {
        const command = "'" + <string>this.sysSvc.appConfigData.pythonCmd + "'";

        const args: string[] = [];
        args.push("'" + `${<string>this.sysSvc.appConfigData.localNapcomDir}/${<string>this.sysSvc.appConfigData.jobSubmitCmd}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlHost}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlUser}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlNodeCluster}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlPwd}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.localNapcomDir}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.remoteNapcomDir}` + "'");
        args.push("'" + `${<string>this.sysSvc.workingDirectory}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.fltstr}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.remotejsonfld}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.localUpdapsacDir}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.remoteUpdapsacDir}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.maxNumberOfRuns}` + "'");
        args.push("'" + `${<string>this.sysSvc._appConfigFileName}` + "'");

        let cumentry = command;
        for (let entry of args) {
            cumentry = cumentry + " " + entry;
        }
        console.log(cumentry)

        this.runForm.patchValue({results: "--> Submit Run"});

        this.run(command, args);
    }

    uploadNapcomFiles() {
        const command = "'" + <string>this.sysSvc.appConfigData.pythonCmd + "'";

        const args: string[] = [];
        args.push("'" + `${<string>this.sysSvc.appConfigData.localNapcomDir}/${<string>this.sysSvc.appConfigData.sendNapcomCmd}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlHost}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlUser}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlNodeCluster}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlPwd}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.localNapcomDir}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.remoteNapcomDir}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.napcomExt}` + "'");
        args.push("'" + `${<string>this.sysSvc.workingDirectory}` + "'");

        // console.log(command + " " + args)
        this.runForm.patchValue({results: "--> Upload NAPCOM Files"});

        this.run(command, args);
    }

    uploadUpdapsFiles() {
        const command = "'" + <string>this.sysSvc.appConfigData.pythonCmd + "'";

        const args: string[] = [];
        args.push("'" + `${<string>this.sysSvc.appConfigData.localNapcomDir}/${<string>this.sysSvc.appConfigData.sendUpdapsCmd}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlHost}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlUser}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlNodeCluster}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlPwd}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.localUpdapsacDir}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.remoteUpdapsacDir}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.updapsacExt}` + "'");

        // console.log(command + " " + args)
        this.runForm.patchValue({results: "--> Upload UPDAPS Files"});

        this.run(command, args);
    }


    checkConnection() {
        const command = "'" + <string>this.sysSvc.appConfigData.pythonCmd + "'";

        const args: string[] = [];
        args.push("'" + `${<string>this.sysSvc.appConfigData.localNapcomDir}/${<string>this.sysSvc.appConfigData.checkConnectionCmd}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlHost}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlUser}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlNodeCluster}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlPwd}` + "'");

        // console.log(command + " " + args)
        this.runForm.patchValue({
            results: "--> Check Connection:" +
                " '" + `${<string>this.sysSvc.appConfigData.anlHost}` + "' " +
                "'" + `${<string>this.sysSvc.appConfigData.anlUser}` + "'"
        });

        this.run(command, args);
    }


    runCommand() {
        // Args can be entered in a comma separated list.  They need to be split and passed as an array for spawn.
        const args: any[] = (this.runForm.value["args"] != null && this.runForm.value["args"].length > 0)
            ? this.runForm.value["args"].split(",")
            : [];

        this.run(<string>this.runForm.value["command"], args);
    }


    run(command: string, args: any[]) {

        // Create a new instance of the run script
        this.runScript = this.scriptService.create();
        this.runScript.run(command, args, (dat: string) => {

            // Callback updates live results
            const patchVal = <string>this.runForm.value["liveResults"] + dat;
            this.runForm.patchValue({liveResults: patchVal});
            this.keepAtBottom();

        }).then((dat: ScriptReturn) => {

            // Valid completion displays the results
            this.runForm.patchValue({results: dat.data});
            this.runForm.patchValue({code: dat.code});

        }).catch(err => {

            // Error displays the returned error
            this.runForm.patchValue({results: err});
            this.runForm.patchValue({code: ""});

        });
    }

    cancel() {
        this.runScript.cancel();
    }

    clear() {
        this.runForm.patchValue({results: ''});
        this.runForm.patchValue({code: ''});
        this.runForm.patchValue({liveResults: ''});
    }

    onTabChanged(event) {
        this.clear();
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
}
