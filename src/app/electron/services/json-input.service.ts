import { Injectable } from '@angular/core';
import {ElectronService} from "./electron.service";

@Injectable({
  providedIn: 'root'
})
export class JsonInputService {

  constructor(private electronService: ElectronService) {
  }

  /**
   * Reads the passed filename from disk as a CSV file
   * and returns JSON.  Returns a promise.
   *
   * @param fileNm
   */
  csvAsJson( fileNm:string) {
    return this.electronService.csv().fromFile(fileNm);
  }

  /**
   * Reads the passed filename from disk as a CSV file
   * and returns JSON.  Returns a promise.
   *
   * @param fileNm
   */
  csvAsJsonNoHeader( fileNm:string) {
    return this.electronService.csv({
      noheader:true,
      trim:true,
    }).fromFile(fileNm);
  }

  /**
   * Reads the spreadsheet given in the passed fileNm and sheet number.
   * Returns as a promise.
   *
   * @param fileNm
   * @param sheetPos
   */
  xlsxToJson(fileNm:string, sheetPos) {

    return new Promise((resolve, reject) => {
      try {
        const workbook = this.electronService.xlsx.readFile(fileNm);
        try {

          const sheet_name_list = workbook.SheetNames;
          resolve (JSON.parse(JSON.stringify(this.electronService.xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[sheetPos]], {defval: ""}))));

        } catch (err) {

          console.log(err);
          reject("Cannot convert XLSX to JSON!");

        }
      } catch (err) {

        console.log(err);
        reject("Unable to Read File!");

      }
    });
  }

  /**
   * Reads a text file from disk and converts it to JSON.  It is assumed the
   * file was saved as valid JSON.  A Promise is returned.
   *
   * @param fnName
   */
  fetchJson( fnName:string ) {
    return this.electronService.fs.readJson(fnName);
  }

  /**
   * Converts a javascript object and writes a Json text file.
   *
   * @param fnName
   */
  writeJson( fnName:string, obj: any ) {
    return this.electronService.fs.writeJson(fnName,obj);
  }
}
