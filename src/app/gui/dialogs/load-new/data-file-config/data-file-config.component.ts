import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SystemConfigService} from "../../../../service/system-config.service";
import {JsonInputService} from "../../../../electron/services";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-data-file-config',
  templateUrl: './data-file-config.component.html',
  styleUrls: ['./data-file-config.component.scss']
})
export class DataFileConfigComponent implements OnInit {
  @Input() reload: Observable<void>;
  loadForm: FormGroup;
  private reloadSubscription: Subscription;

  constructor(
    private sysSvc: SystemConfigService,
    private jsonSvc: JsonInputService,
    private fb: FormBuilder) {
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
      axleLoadSi_fl: [this.sysSvc.filePath('AxleLoadSi'),[required]],
      axleLoadTa_fl: [this.sysSvc.filePath('AxleLoadTa'),[required]],
      axleLoadTr_fl: [this.sysSvc.filePath('AxleLoadTr'),[required]],
      axleConfiguration_fl: [this.sysSvc.filePath('AxleConfiguration'),[required]],
      fipsCode_fl: [this.sysSvc.filePath('StatesRegions'),[required]],
      countyFips_fl: [this.sysSvc.filePath('CountyData'),[required]],
      highwayGroups_fl: [this.sysSvc.filePath('HighwayGroups'),[required]],
      baseModulus_fl: [this.sysSvc.filePath('BaseDefaults'),[required]],
      subgradeModulus_fl: [this.sysSvc.filePath('SubgradeDefaults'),[required]],
      soilProperties_fl: [this.sysSvc.filePath('SoilProperties'),[required]],
      merra2List_fl: [this.sysSvc.filePath('MERRA2List'),[required]],
      estarCoeffs_fl: [this.sysSvc.filePath('EstarCoeffs'),[required]],
      hmaGradation_fl: [this.sysSvc.filePath('HMAGradation'),[required]],
      hpms_fl: [this.sysSvc.filePath('HPMSData'),[required]]
    });
  }

  /**
   * Called when the submit button is pressed.  Initiates the
   * file reads and on successful completion, stores the data in the
   * Run Service than exits.
   */
  save() {
    // In case the file names have changed.  Move over to the system defaults.
    this.sysSvc.setFileName('AxleLoadSi', <string>this.loadForm.value["axleLoadSi_fl"] );
    this.sysSvc.setFileName('AxleLoadTa', <string>this.loadForm.value["axleLoadTa_fl"] );
    this.sysSvc.setFileName('AxleLoadTr', <string>this.loadForm.value["axleLoadTr_fl"] );
    this.sysSvc.setFileName('AxleConfiguration', <string>this.loadForm.value["axleConfiguration_fl"] );
    this.sysSvc.setFileName('StatesRegions', <string>this.loadForm.value["fipsCode_fl"] );
    this.sysSvc.setFileName('CountyData', <string>this.loadForm.value["countyFips_fl"] );
    this.sysSvc.setFileName('HighwayGroups', <string>this.loadForm.value["highwayGroups_fl"] );
    this.sysSvc.setFileName('BaseDefaults', <string>this.loadForm.value["baseModulus_fl"] );
    this.sysSvc.setFileName('SubgradeDefaults', <string>this.loadForm.value["subgradeModulus_fl"] );
    this.sysSvc.setFileName('SoilProperties', <string>this.loadForm.value["soilProperties_fl"] );
    this.sysSvc.setFileName('MERRA2List', <string>this.loadForm.value["merra2List_fl"] );
    this.sysSvc.setFileName('EstarCoeffs', <string>this.loadForm.value["estarCoeffs_fl"] );
    this.sysSvc.setFileName('HMAGradation', <string>this.loadForm.value["hmaGradation_fl"] );
    this.sysSvc.setFileName('HPMSData', <string>this.loadForm.value["hpms_fl"] );

    return this.loadData();
  }

  /**
   * Executes the reading of all data files, converting their contents to JSON
   * and returning a single JSON structure containing all data from the read
   * files.
   *
   * @private
   */
  private loadData(){
    // Store all promises
    const promises = [];

    promises.push( this.jsonSvc.csvAsJsonNoHeader(
      <string>this.loadForm.value["axleLoadSi_fl"]).then( json => {
      return {axleLoadSi:json};
    }));

    promises.push( this.jsonSvc.csvAsJsonNoHeader(
      <string>this.loadForm.value["axleLoadTa_fl"]).then( json => {
      return {axleLoadTa:json};
    }));

    promises.push( this.jsonSvc.csvAsJsonNoHeader(
      <string>this.loadForm.value["axleLoadTr_fl"]).then( json => {
      return {axleLoadTr:json};
    }));

    promises.push( this.jsonSvc.csvAsJson(
      <string>this.loadForm.value["axleConfiguration_fl"]).then( json => {
      return {axleConfig:json};
    }));

    promises.push( this.jsonSvc.csvAsJson(
      <string>this.loadForm.value["hpms_fl"]).then( json => {
      return {hpms:json};
    }));

    promises.push( this.jsonSvc.csvAsJson(
      <string>this.loadForm.value["fipsCode_fl"]).then( json => {
      return {fipsCode:json};
    }));

    promises.push( this.jsonSvc.csvAsJson(
      <string>this.loadForm.value["countyFips_fl"]).then( json => {
      return {countyFips:json};
    }));

    promises.push( this.jsonSvc.csvAsJson(
      <string>this.loadForm.value["merra2List_fl"]).then( json => {
      return {merra2List:json};
    }));

    promises.push( this.jsonSvc.csvAsJson(
      <string>this.loadForm.value["estarCoeffs_fl"]).then( json => {
      return {estarCoeffs:json};
    }));

    promises.push( this.jsonSvc.csvAsJson(
      <string>this.loadForm.value["hmaGradation_fl"]).then( json => {
      return {hmaGradation:json};
    }));

    promises.push( this.jsonSvc.csvAsJson(
      <string>this.loadForm.value["highwayGroups_fl"]).then( json => {
      return {highwayGroups:json};
    }));

    promises.push( this.jsonSvc.csvAsJson(
      <string>this.loadForm.value["baseModulus_fl"]).then( json => {
      return {baseModulus:json};
    }));

    promises.push( this.jsonSvc.csvAsJson(
      <string>this.loadForm.value["subgradeModulus_fl"]).then( json => {
      return {subgradeModulus:json};
    }));

    promises.push( this.jsonSvc.csvAsJson(
      <string>this.loadForm.value["soilProperties_fl"]).then( json => {
      return {soilProperties:json};
    }));

    // Execute all of the promises at once.  The 'then' condition will not be implemented
    // until all promises have been resolved.
    return Promise.all(promises).then((values) => {
      let obj = {} ;

      // Creating a single JSON object from the returned file reads (which are now JSON objects).
      // Each JSON object returned will be given an entry so it will look like
      //    { config: [...], fipsCode: [...], countyFips: [...], etc...}

      values.forEach( value => {
        obj = Object.assign( obj, value );
      });
      this.sysSvc.dataHasBeenRead = true;

      return(obj);
    }).catch(err => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      console.log(`File Load Error : ${err}`);
    } );
  }

  ngOnDestroy() {
    this.reloadSubscription.unsubscribe();
  }
}

