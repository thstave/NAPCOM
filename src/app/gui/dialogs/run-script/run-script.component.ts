import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ElectronService, ScriptReturn, ScriptService} from "../../../electron/services";
import {RunScript} from "../../../electron/services/run-script";
import {SystemConfigService} from "../../../service/system-config.service";
import {Subject} from "rxjs";
// import { ProductPieChartsComponent } from '../../../charts/product-pie-charts/product-pie-charts.component';
// import { productSales, productSalesMulti} from '../../../data/products';

@Component({
    selector: 'app-run-script',
    templateUrl: './run-script.component.html',
    styleUrls: ['./run-script.component.scss']

})

export class RunScriptComponent implements OnInit {
    @ViewChild('liveupdate') private liveUpdateElement: ElementRef;
    @ViewChild('submitupdate') private submitUpdateElement: ElementRef;
    @ViewChild('runstatusupdate') private runstatusUpdateElement: ElementRef;

    runForm: FormGroup;
    anlForm: FormGroup;
    update$: Subject<any> = new Subject();

    piechartdata = [
        {
            "name": "Error",
            "value": 0
        }, {
            "name": "Complete",
            "value": 0
        }, {
            "name": "Incomplete",
            "value": 100

        }
    ];
    view: any[] = [700, 370];
    // options
    // showLegend: boolean = true;
    // showLabels: boolean = true;
    gradient: boolean = true;
    // isDoughnut: boolean = false;
    // legendPosition: string = 'below';
    colorScheme = {
        domain: ['#704FC4', '#4B852C', '#B67A3D', '#5B6FC8', '#25706F']
    };


    private runScript: RunScript = undefined;

    constructor(private fb: FormBuilder,
                private scriptService: ScriptService,
                private sysSvc: SystemConfigService,
                private electronService: ElectronService) {
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
            liveResults: ["\n", []],
            livesubmitResults: ["\n", []],
            estimatedruntime: ["\n", []],
            runstatusupdateResults: ["\n", []]
        });
    }

    getUPDAPSRunStatus() {
        const command = "'" + <string>this.sysSvc.appConfigData.pythonCmd + "'";

        const args: string[] = [];
        args.push("'" + `${<string>this.sysSvc.appConfigData.localNapcomDir}/${<string>this.sysSvc.appConfigData.getUPDAPSRunStatusCmd}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlHost}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlUser}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlNodeCluster}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlPwd}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.localNapcomDir}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.remoteNapcomDir}` + "'");
        args.push("'" + `${<string>this.sysSvc.workingDirectory}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.remotejsonfld}` + "'");
        this.run(command, args);

        // let cumentry = command;
        // for (let entry of args) {
        //     cumentry = cumentry + " " + entry;
        // }
        // console.log(cumentry)

        this.runForm.patchValue({
            runstatusupdateResults: "--> Running " + `${<string>this.sysSvc.appConfigData.getUPDAPSRunStatusCmd}` +
                " at '" + `${<string>this.sysSvc.appConfigData.anlHost}` + "' for user " +
                "'" + `${<string>this.sysSvc.appConfigData.anlUser}` + "'"
        });     //    Watch and read the status file

        const fpath = `${<string>this.sysSvc.workingDirectory}` +
            '/' + `${<string>this.sysSvc.appConfigData.UPDAPSstatustxtfname}`;
        // this.electronService.fs.remove(fpath);
        // this.readUPDAPSStatusfile(fpath);
        this.watchstatusfile2(fpath);


    }

    readNAPCOMRemoteStatusfile(fpath) {

        // Read the file and compute the status statistics: number of complete, incomplete and error
        try {
            if (this.electronService.fs.existsSync(fpath)) {
                var array = this.electronService.fs.readFileSync(fpath).toString().split("\n");
                for (let i in array) {
                    // console.log("Row - " + i + ":" + array[i]);
                    var arri = array[i].split(":")
                    // console.log("Json:" + arri[0])
                    // console.log("Status:" + arri[1])
                    if (typeof arri[0] !== "undefined") {
                        if (arri[0].includes("Estimated UPDAPS runtime (hrs)")) {
                            var runtime = arri[1]
                            console.log("Estimated UPDAPS runtime (hrs): " + runtime)
                        }
                    }
                }
                this.runForm.patchValue({
                    estimatedruntime:
                        "Estimated UPDAPS runtime (hrs): " + runtime + "\n"
                });
            }

        } catch (err) {
            console.error(err)
        }
    }

    readUPDAPSStatusfile(fpath) {

        // Read the file and compute the status statistics: number of complete, incomplete and error
        try {
            if (this.electronService.fs.existsSync(fpath)) {
                var ncompl = 0;
                var nincompl = 0;
                var nerr = 0;
                var array = this.electronService.fs.readFileSync(fpath).toString().split("\n");
                for (let i in array) {
                    // console.log("Row - " + i + ":" + array[i]);
                    var arri = array[i].split(",")
                    // console.log("Json:" + arri[0])
                    // console.log("Status:" + arri[1])
                    if (typeof arri[1] !== "undefined") {
                        if (arri[1].includes("incomplete")) {
                            nincompl++;
                        } else if (arri[1].includes("complete")) {
                            ncompl++;
                        } else if (arri[1].includes("error")) {
                            nerr++;
                        }
                    }
                }
                console.log("Number of completed: " + ncompl)
                console.log("Number of incomplete: " + nincompl)
                console.log("Number of error: " + nerr)

                this.runForm.patchValue({
                    runstatusupdateResults:
                        "Number of completed: " + ncompl + "\n" +
                        "Number of incomplete: " + nincompl + "\n" +
                        "Number of error: " + nerr + "\n"
                });

                // var ntot = ncompl + nincompl + nerr;
                // var pctot = ncompl/ntot*100;
                // var pitot = nincompl/ntot*100;
                // var petot = nerr/ntot*100;


                // By updating data below, pie chart is supposed to be updated automatically
                this.piechartdata = [
                    {
                        "name": "Error",
                        "value": nerr
                    }, {
                        "name": "Complete",
                        "value": ncompl
                    }, {
                        "name": "Incomplete",
                        "value": nincompl
                    }
                ];

                // update chart
                this.piechartdata = [...this.piechartdata];

                // // stop watching the file
                // console.log("--> Stopped watching file: " + fpath)
                // this.electronService.fs.unwatchFile(fpath);


            }

        } catch (err) {
            console.error(err)
        }
    }


    computeShares() {
        const command = "'" + <string>this.sysSvc.appConfigData.pythonCmd + "'";

        const args: string[] = [];
        args.push("'" + `${<string>this.sysSvc.appConfigData.localNapcomDir}/${<string>this.sysSvc.appConfigData.computeSharesCmd}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlHost}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlUser}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlNodeCluster}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.anlPwd}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.localNapcomDir}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.remoteNapcomDir}` + "'");
        args.push("'" + `${<string>this.sysSvc.workingDirectory}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.remotejsonfld}` + "'");
        args.push("'" + `${<string>this.sysSvc.appConfigData.fileNames.HPMSData}` + "'");

        let cumentry = command;
        for (let entry of args) {
            cumentry = cumentry + " " + entry;
        }
        console.log(cumentry)

        this.runForm.patchValue({
            runstatusupdateResults: "--> Checking  active runs: " +
                " '" + `${<string>this.sysSvc.appConfigData.anlHost}` + "' " +
                "'" + `${<string>this.sysSvc.appConfigData.anlUser}` + "'"
        });

        this.runnolive2(command, args);


        // console.log(NAPCOMstatustxt)

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
            runstatusupdateResults: "--> Checking  active runs: " +
                " '" + `${<string>this.sysSvc.appConfigData.anlHost}` + "' " +
                "'" + `${<string>this.sysSvc.appConfigData.anlUser}` + "'"
        });

        this.runnolive2(command, args);


        // console.log(NAPCOMstatustxt)

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
        this.runForm.patchValue({runstatusupdateResults: "--> Cancel Run"});

        this.runnolive2(command, args);

        this.electronService.fs.unwatchFile(`${<string>this.sysSvc.workingDirectory}` + '/' + `${<string>this.sysSvc.appConfigData.NAPCOMstatustxtfname}`)
        this.electronService.fs.unwatchFile(`${<string>this.sysSvc.workingDirectory}` + '/' + `${<string>this.sysSvc.appConfigData.UPDAPSstatustxtfname}`)


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

        this.runnolive1(command, args);


        //    Watch and read the status file
        const fpath = `${<string>this.sysSvc.workingDirectory}` +
            '/' + `${<string>this.sysSvc.appConfigData.NAPCOMstatustxtfname}`;
        this.electronService.fs.remove(fpath);
        this.watchstatusfile(fpath);

        // const NAPCOMstatustxt = this.electronService.fs.readFileSync(fpath, 'utf-8');
        // this.runForm.patchValue({liveResults: NAPCOMstatustxt});
        // this.keepAtBottom();

        this.runForm.patchValue({
            estimatedruntime:
                "Please wait, computing (this can take several minutes)... \n"
        });
        const fpath3 = `${<string>this.sysSvc.workingDirectory}` +
            '/' + `${<string>this.sysSvc.appConfigData.NAPCOMstatusremotetxtfname}`;
        // this.electronService.fs.remove(fpath);
        // this.readUPDAPSStatusfile(fpath);
        console.log("--> Will start watching:" + fpath3)
        this.watchstatusfile3(fpath3);


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
                    interval: 3000,

                },
                (curr, prev) => {
                    console.log("\n The file was edited: " + fpath + "\n");
                    // Show the time when the file was modified
                    console.log("Previous Modified Time", prev.mtime);
                    console.log("Current Modified Time", curr.mtime);

                    const statustxt = this.electronService.fs.readFileSync(fpath, "utf8")
                    // console.log("The contents of the " + fpath + " are:\n" + statustxt);
                    // var idxno = statustxt.indexOf(",")
                    // console.log(idxno)

                    // var idxno = statearri.slice(0, statustxt.indexOf("-"))

                    // this.runForm.patchValue({"livesubmitResults": statustxt});
                    // this.keepAtBottomsubmitupdate()

                    var idxno = statustxt.indexOf("Estimated UPDAPS runtime (hrs)")
                    console.log(idxno)
                    if (idxno > -1) {
                        this.electronService.fs.unwatchFile(fpath)
                        console.log("\n> File has been stopped watching");
                        this.readNAPCOMRemoteStatusfile(fpath);
                        console.log("\n> File has been read:" + fpath);
                    }

                }
            );
        } catch (err) {
            console.error(err)
        }


    }

    watchstatusfile2(fpath: string) {

        try {
            if (this.electronService.fs.existsSync(fpath)) {
                //file exists
                console.log("... File exists, please wait for update ...")
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
                        interval: 3000,

                    },
                    (curr, prev) => {
                        console.log("\nThe file was edited");
                        // Show the time when the file was modified
                        console.log("Previous Modified Time", prev.mtime);
                        console.log("Current Modified Time", curr.mtime);

                        const statustxt = this.electronService.fs.readFileSync(fpath, "utf8")
                        // console.log("The contents of the " + fpath + " are:\n" + statustxt);
                        // var idxno = statustxt.indexOf(",")
                        // console.log(idxno)


                        // var idxno = statearri.slice(0, statustxt.indexOf("-"))

                        // this.runForm.patchValue({"livesubmitResults": statustxt});
                        // this.keepAtBottomsubmitupdate()

                        var idxno = statustxt.indexOf("---> END <---")
                        console.log(idxno)
                        if (idxno > -1) {
                            this.electronService.fs.unwatchFile(fpath)
                            console.log("\n> File has been stopped watching");
                            this.readUPDAPSStatusfile(fpath);
                            console.log("\n> File has been read");
                        }

                    }
                );
            } else {
                console.log("... Please wait ...")
            }
        } catch (err) {
            console.error(err)
        }


    }

    watchstatusfile(fpath: string) {

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
                interval: 3000,
            },
            (curr, prev) => {
                console.log("\nThe file was edited");
                // Show the time when the file was modified
                console.log("Previous Modified Time", prev.mtime);
                console.log("Current Modified Time", curr.mtime);

                const statustxt = this.electronService.fs.readFileSync(fpath, "utf8")

                // console.log("The contents of the current file are:", NAPCOMstatustxt);
                this.runForm.patchValue({"livesubmitResults": statustxt});
                this.keepAtBottomsubmitupdate()
                var idxno = statustxt.indexOf("---> JOB SUBMISSION HAVE BEEN COMPLETED ")
                console.log(idxno)
                if (idxno > -1) {
                    this.electronService.fs.unwatchFile(fpath)
                    console.log("\n> File has been stopped watching");

                }

            }
        );
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

        this.runnolive4(<string>this.runForm.value["command"], args);
    }


    runnolive1(command: string, args: any[]) {

        // Create a new instance of the run script
        this.runScript = this.scriptService.create();
        this.runScript.runNoLive(command, args, (dat: string) => {

            // Callback updates live results
            const patchVal = dat;
            this.runForm.patchValue({livesubmitResults: patchVal});
            this.keepAtBottom();

        }).then((dat: ScriptReturn) => {

            // Valid completion displays the results
            this.runForm.patchValue({livesubmitResults: dat.data});
            // this.runForm.patchValue({code: dat.code});

        }).catch(err => {

            // Error displays the returned error
            this.runForm.patchValue({livesubmitResults: err});
            // this.runForm.patchValue({code: ""});

        });
    }

    runnolive2(command: string, args: any[]) {

        // Create a new instance of the run script
        this.runScript = this.scriptService.create();
        this.runScript.runNoLive(command, args, (dat: string) => {

            // Callback updates live results
            const patchVal = dat;
            this.runForm.patchValue({runstatusupdateResults: patchVal});
            this.keepAtBottom();

        }).then((dat: ScriptReturn) => {

            // Valid completion displays the results
            this.runForm.patchValue({runstatusupdateResults: dat.data});
            // this.runForm.patchValue({code: dat.code});

        }).catch(err => {

            // Error displays the returned error
            this.runForm.patchValue({runstatusupdateResults: err});
            // this.runForm.patchValue({code: ""});

        });
    }

    runnolive4(command: string, args: any[]) {

        // Create a new instance of the run script
        this.runScript = this.scriptService.create();
        this.runScript.runNoLive(command, args, (dat: string) => {
            // Callback updates live results
            const patchVal = dat;
            this.runForm.patchValue({results: patchVal});
            this.keepAtBottom();
        }).then((dat: ScriptReturn) => {
            // Valid completion displays the results
            this.runForm.patchValue({results: dat.data});
        }).catch(err => {
            // Error displays the returned error
            this.runForm.patchValue({results: err});
        });
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
        // this.clear();

    }

    keepAtBottomsubmitupdate()
        :
        void {
        try {
            this.submitUpdateElement.nativeElement.scrollTop = this.submitUpdateElement.nativeElement.scrollHeight;
        } catch (err) {
            console.log(err);
        }
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
