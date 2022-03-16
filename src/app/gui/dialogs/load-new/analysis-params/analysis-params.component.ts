import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {SystemConfigService} from "../../../../service/system-config.service";
import {ScriptReturn, ScriptService} from "../../../../electron/services";
import {RunScript} from "../../../../electron/services/run-script";

@Component({
    selector: 'app-analysis-params',
    templateUrl: './analysis-params.component.html',
    styleUrls: ['./analysis-params.component.scss']
})
export class AnalysisParamsComponent implements OnInit {
    @Input() reload: Observable<void>;
    loadForm: FormGroup;
    private reloadSubscription: Subscription;
    private runScript: RunScript = undefined;

    states: string[] = [
        '1-AL',
        '2-AK',
        '4-AZ',
        '5-AR',
        '6-CA',
        '8-CO',
        '9-CT',
        '10-DE',
        '11-DC',
        '12-FL',
        '13-GA',
        '15-HI',
        '16-ID',
        '17-IL',
        '18-IN',
        '19-IA',
        '20-KS',
        '21-KY',
        '22-LA',
        '23-ME',
        '24-MD',
        '25-MA',
        '26-MI',
        '27-MN',
        '28-MS',
        '29-MO',
        '30-MT',
        '31-NE',
        '32-NV',
        '33-NH',
        '34-NJ',
        '35-NM',
        '36-NY',
        '37-NC',
        '38-ND',
        '39-OH',
        '40-OK',
        '41-OR',
        '42-PA',
        '44-RI',
        '45-SC',
        '46-SD',
        '47-TN',
        '48-TX',
        '49-UT',
        '50-VT',
        '51-VA',
        '53-WA',
        '54-WV',
        '55-WI',
        '56-WY',
        '60-ASA',
        '66-GUM',
        '69-NMI',
        '72-PRC',
        '78-VIU',
    ];

    surfacetypes: string[] = [
        '1-Unpaved',
        '2-Bituminous',
        '3-JPCP - Jointed Plain Concrete Pavement',
        '4-JRCP - Jointed Reinforced Concrete Pavement',
        '5-CRCP - Continuously Reinforced Concrete Pavement',
        '6-Asphalt-Concrete (AC) Overlay over Existing AC Pavement',
        '7-AC Overlay over Existing Jointed Concrete Pavement',
        '8-AC (Bi Overlay over Existing CRCP)',
        '9-Unbonded Jointed Concrete Overlay on PCC Pavements',
        '10-Bonded PCC Overlays on PCC Pavements',
    ];

    functionalclasses: string[] = [
        '1-Interstate',
        '2-Principal Arterial-Other Freeways & Expressways',
        '3-Minor Arterial',
        '4-Major Collector ',
        '5-Minor Collector',
        '6-Local',
    ];

    constructor(private sysSvc: SystemConfigService,
                private fb: FormBuilder,
                private scriptService: ScriptService) {
    }

    selectedstates = new FormControl();
    selectedsurfacetypes = new FormControl();
    selectedfunctionalclass = new FormControl();

    ngOnInit() {
        this.reloadSubscription = this.reload.subscribe(() => this.initializeForm());
        this.initializeForm();
    }

    createquery(qryname, statearr) {
        let cumentry = qryname + "==[";
        let n = 0;
        for (let statearri of statearr) {
            var idxno = statearri.slice(0, statearri.indexOf("-"))

            if (n === 0) {
                cumentry = cumentry + idxno;
            } else {
                cumentry = cumentry + ", " + idxno;
            }
            n = n + 1;
        }
        cumentry = cumentry + "]";
        return cumentry
    }

    updatefilterstring() {
        this.loadForm.patchValue({fltstr: ""});

        // ------------------- Selected states
        let statearr = this.selectedstates.value;
        console.log(statearr)
        let cumentry;
        if (statearr === null || typeof statearr[0] === "undefined") {
            console.log('---- ALL States Selected --- ')
            // this.loadForm.controls.selectedState.patchValue([]);
            cumentry = "";
        } else {
            cumentry = this.createquery("state_code", statearr);
        }
        this.loadForm.patchValue({fltstr: cumentry});


        // ------------------- Selected surface types
        let surfarr = this.selectedsurfacetypes.value;
        console.log(surfarr)
        if (surfarr === null || typeof surfarr[0] === "undefined") {
            console.log('---- ALL base types Selected --- ')
            // this.loadForm.patchValue({fltstr: ""});
        } else {
            if (cumentry === "") {
                cumentry = this.createquery("surface_type", surfarr);
            } else {
                cumentry = cumentry + " and " + this.createquery("surface_type", surfarr);
            }

            this.loadForm.patchValue({fltstr: cumentry});
        }

        // ------------------- Selected functional classes
        let funcarr = this.selectedfunctionalclass.value;
        console.log(funcarr)
        if (funcarr === null || typeof funcarr[0] === "undefined") {
            console.log('---- ALL functional classes have been Selected --- ')
            // this.loadForm.patchValue({fltstr: ""});
        } else {
            if (cumentry === "") {
                cumentry = this.createquery("f_system", funcarr);
            } else {
                cumentry = cumentry + " and " + this.createquery("f_system", funcarr);
            }
            this.loadForm.patchValue({fltstr: cumentry});
        }

    }

    checknumberofHPMSsections() {
        const command = "'" + <string>this.sysSvc.appConfigData.pythonCmd + "'";

        const args: string[] = [];
        args.push("'" + `${<string>this.sysSvc.appConfigData.localNapcomDir}/${<string>this.sysSvc.appConfigData.computenumHPMSsecscmd}` + "'");
        args.push("'" + `${<string>this.sysSvc.workingDirectory}` + "'");
        args.push("'" + `${<string>this.sysSvc.filePath('HPMSData')}` + "'");
        args.push("'" + `${<string>this.loadForm.value["fltstr"]}` + "'");

        let cumentry = command;
        for (let entry of args) {
            cumentry = cumentry + " " + entry;
        }
        console.log(cumentry)

        this.loadForm.patchValue({
            maxNumberOfRuns: "--> Computing number of HPMS sections for " +
                "'" + `${<string>this.loadForm.value["fltstr"]}` + "'"
        });

        this.run(command, args);
    }

    run(command
            :
            string, args
            :
            any[]
    ) {

        // Create a new instance of the run script
        this.runScript = this.scriptService.create();
        this.runScript.run(command, args, (dat: string) => {

            // Callback updates live results
            const patchVal = <string>this.loadForm.value["maxNumberOfRuns"] + dat;
            this.loadForm.patchValue({liveResults: patchVal});

        }).then((dat: ScriptReturn) => {

            // Valid completion displays the results
            this.loadForm.patchValue({maxNumberOfRuns: dat.data});

        }).catch(err => {

            // Error displays the returned error
            this.loadForm.patchValue({maxNumberOfRuns: err});

        });
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

