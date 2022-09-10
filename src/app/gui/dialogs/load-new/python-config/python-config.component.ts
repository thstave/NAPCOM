import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SystemConfigService} from "../../../../service/system-config.service";
import {ElectronService, ScriptReturn, ScriptService} from "../../../../electron/services";
import {RunScript} from "../../../../electron/services/run-script";

@Component({
    selector: 'app-python-config',
    templateUrl: './python-config.component.html',
    styleUrls: ['./python-config.component.scss']
})
export class PythonConfigComponent implements OnInit {
    @ViewChild('liveupdate1') private liveUpdateElement: ElementRef;

    @Input() reload: Observable<void>;
    pythonForm: FormGroup;
    private reloadSubscription: Subscription;
    private runScript: RunScript = undefined;

    constructor(private sysSvc: SystemConfigService,
                private fb: FormBuilder,
                private systemConfigService: SystemConfigService,
                private scriptService: ScriptService,
                private electronService: ElectronService) {
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
            localUpdapsPCCDir: [this.sysSvc.appConfigData.localUpdapsPCCDir, [required]],
            remoteUpdapsPCCDir: [this.sysSvc.appConfigData.remoteUpdapsPCCDir, [required]],
            liveResults1: ["\n", []]
        });
    }

    /**
     * Called to store the data.  Returns a promise.
     */
    save() {
        return new Promise((resolve) => {
            this.sysSvc.appConfigData.pythonCmd = this.pythonForm.value["pythonCmd"];
            this.sysSvc.appConfigData.jobSubmitCmd = this.pythonForm.value["jobSubmitCmd"];
            this.sysSvc.appConfigData.sendNapcomCmd = this.pythonForm.value["sendNapcomCmd"];
            this.sysSvc.appConfigData.localNapcomDir = this.pythonForm.value["localNapcomDir"];
            this.sysSvc.appConfigData.remoteNapcomDir = this.pythonForm.value["remoteNapcomDir"];
            this.sysSvc.appConfigData.sendUpdapsCmd = this.pythonForm.value["sendUpdapsCmd"];
            this.sysSvc.appConfigData.localUpdapsacDir = this.pythonForm.value["localUpdapsacDir"];
            this.sysSvc.appConfigData.remoteUpdapsacDir = this.pythonForm.value["remoteUpdapsacDir"];
            this.sysSvc.appConfigData.localUpdapsPCCDir = this.pythonForm.value["localUpdapsPCCDir"];
            this.sysSvc.appConfigData.remoteUpdapsPCCDir = this.pythonForm.value["remoteUpdapsPCCDir"];
            resolve({});
        });
    }

    uploadNapcomFiles() {
        const fpath3 = `${<string>this.sysSvc.appConfigData.localNapcomDir}` +
            '/' + `__Status.txt`;
        // this.electronService.fs.remove(fpath);
        console.log("--> Will start watching:" + fpath3)
        this.watchstatusfile3(fpath3);
        
        console.log('Saving first...')
        this.save()
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
        // args.push("'" + `${<string>this.sysSvc.workingDirectory}` + "'");

        console.log(command + " " + args)
        this.pythonForm.patchValue({liveResults1: "Uploading NAPCOM codes"});

        this.run(command, args);
    }

    uploadNapcomData() {
        const fpath3 = `${<string>this.sysSvc.appConfigData.localNapcomDir}` +
            '/' + `__Status.txt`;
        // this.electronService.fs.remove(fpath);
        console.log("--> Will start watching:" + fpath3)
        this.watchstatusfile3(fpath3);

        console.log('Saving first...')
        this.save()
        const command = "'" + <string>this.sysSvc.appConfigData.pythonCmd + "'";

        const args: string[] = [];
        args.push("'" + `${<string>this.sysSvc.appConfigData.localNapcomDir}/${<string>this.sysSvc.appConfigData.sendNapcomCmd}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlHost}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlUser}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlNodeCluster}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlPwd}` + "'");
        args.push("'" + `${<string>this.sysSvc.workingDirectory}` + "'"); // source is data directory not the code directory
        args.push("'" + `${<string>this.sysSvc.appConfigData.remoteNapcomDir}` + "/io/'");
        args.push("'" + `*.*` + "'"); // extensions are all
        // args.push("'" + `${<string>this.sysSvc.workingDirectory}` + "'");

        console.log(command + " " + args)
        this.pythonForm.patchValue({liveResults1: "Uploading NAPCOM data..."});

        this.run(command, args);

    }

    uploadUpdapsACFiles() {
        const fpath3 = `${<string>this.sysSvc.appConfigData.localNapcomDir}` +
            '/' + `__Status.txt`;
        // this.electronService.fs.remove(fpath);
        console.log("--> Will start watching:" + fpath3)
        this.watchstatusfile3(fpath3);

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
        this.pythonForm.patchValue({liveResults1: "Uploading UPDAPSAC codes..."});

        this.run(command, args);

    }

    uploadUpdapsPCCFiles() {

        const fpath3 = `${<string>this.sysSvc.appConfigData.localNapcomDir}` +
            '/' + `__Status.txt`;
        // this.electronService.fs.remove(fpath);
        console.log("--> Will start watching:" + fpath3)
        this.watchstatusfile3(fpath3);


        const command = "'" + <string>this.sysSvc.appConfigData.pythonCmd + "'";

        const args: string[] = [];
        args.push("'" + `${<string>this.sysSvc.appConfigData.localNapcomDir}/${<string>this.sysSvc.appConfigData.sendUpdapsCmd}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlHost}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlUser}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlNodeCluster}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlPwd}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.localUpdapsPCCDir}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.remoteUpdapsPCCDir}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.updapsacExt}` + "'");

        console.log(command + " " + args)
        this.pythonForm.patchValue({liveResults1: "Uploading UPDAPSPCC codes..."});

        this.run(command, args);
        // this.runremotecommand('pwd');

    }


    runremotecommand(remotecommand: string) {
        const command = "'" + <string>this.sysSvc.appConfigData.pythonCmd + "'";
        const args: string[] = [];
        args.push("'" + `${<string>this.sysSvc.appConfigData.localNapcomDir}/${<string>this.sysSvc.appConfigData.sendremoteCmd}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlHost}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlUser}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlNodeCluster}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlPwd}` + "'");
        args.push("'" + remotecommand + "'");
        console.log(command + " " + args)
        this.runnolive(command, args);
        this.keepAtBottom();

    }

    runnolive(command: string, args: any[]) {

        // Create a new instance of the run script
        this.runScript = this.scriptService.create();
        this.runScript.runNoLive(command, args, (dat: string) => {

            // Callback updates live results
            const patchVal = <string>this.pythonForm.value["liveResults1"] + dat;
            this.pythonForm.patchValue({liveResults: patchVal});
            this.keepAtBottom();

        }).then((dat: ScriptReturn) => {

            // Valid completion displays the results
            this.pythonForm.patchValue({results: dat.data});
            this.pythonForm.patchValue({code: dat.code});

        }).catch(err => {

            // Error displays the returned error
            this.pythonForm.patchValue({results: err});
            this.pythonForm.patchValue({code: ""});

        });
    }


    run(command: string, args: any[]) {

        // Create a new instance of the run script
        this.runScript = this.scriptService.create();
        this.runScript.run(command, args, (dat: string) => {

            // Callback updates live results
            const patchVal = <string>this.pythonForm.value["liveResults"] + dat;
            this.pythonForm.patchValue({liveResults: patchVal});
            this.keepAtBottom();

        }).then((dat: ScriptReturn) => {

            // Valid completion displays the results
            this.pythonForm.patchValue({results: dat.data});
            this.pythonForm.patchValue({code: dat.code});

        }).catch(err => {

            // Error displays the returned error
            this.pythonForm.patchValue({results: err});
            this.pythonForm.patchValue({code: ""});

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

    watchstatusfile3(fpath: string) {

        try {
            //file exists
            this.electronService.fs.watchFile(
                // The name of the file to watch
                fpath,
                // The options parameter is used to modify the behaviour of the method
                {
                    // Specify the use of big integers in the Stats object
                    bigint: false,

                    // Specify if the process should continue as long as file is watched
                    persistent: true,

                    // Specify the interval between each poll the file
                    interval: 2000,

                },
                (curr, prev) => {
                    console.log("\nThe file was edited");
                    // Show the time when the file was modified
                    console.log("Previous Modified Time", prev.mtime);
                    console.log("Current Modified Time", curr.mtime);

                    const statustxt = this.electronService.fs.readFileSync(fpath, "utf8")

                    console.log("The contents of the current file are:", statustxt);
                    this.pythonForm.patchValue({liveResults1: statustxt});

                    this.keepAtBottom()
                    var idxno = statustxt.indexOf("---> DONE")
                    console.log(idxno)
                    if (idxno > -1) {
                        this.electronService.fs.unwatchFile(fpath)
                        console.log("\n> File has been stopped watching");

                    }

                }
            );
        } catch (err) {
            console.error(err)
        }


    }


}
