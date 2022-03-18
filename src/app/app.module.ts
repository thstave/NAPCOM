import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {HttpClientModule, HttpClient} from '@angular/common/http';
import {ElectronModule} from './electron/electron.module';
import {SharedModule} from './shared/shared.module';
import {AppRoutingModule} from './app-routing.module';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';

import {AppComponent} from './app.component';
import {MaterialModule} from './material.module';
import {LoadNewComponent} from './gui/dialogs/load-new/load-new.component';
import {ReactiveFormsModule} from "@angular/forms";
import {SystemConfigService} from "./service/system-config.service";
import {RunDataService} from "./service/run-data.service";
import {JsonTableComponent} from './gui/json-table-data/json-table.component';
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SidebarMenuComponent} from './main/sidebar-menu/sidebar-menu.component';
import {MainAppComponent} from './main/main-app/main-app.component';
import {DataFileConfigComponent} from "./gui/dialogs/load-new/data-file-config/data-file-config.component";
import {AnalysisParamsComponent} from "./gui/dialogs/load-new/analysis-params/analysis-params.component";
import {SingleTableContentComponent} from './gui/single-table-content/single-table-content.component';
import {MultiTableContentComponent} from './gui/multi-table-content/multi-table-content.component';
import {HomeComponent} from "./home/home.component";
import {RunScriptComponent} from './gui/dialogs/run-script/run-script.component';
import {CopyDirComponent} from "./gui/dialogs/copy-dir/copy-dir.component";
import {PythonConfigComponent} from './gui/dialogs/load-new/python-config/python-config.component';
import {ConnectionComponent} from './gui/dialogs/load-new/connection/connection.component';

// import { BrowserModule } from '@angular/platform-browser';
// import { NgModule } from '@angular/core';
// import { AppComponent } from './app.component';
// import { NgxChartsModule } from '@swimlane/ngx-charts';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import * as PlotlyJS from 'plotly.js-dist-min';
// import { PlotlyModule } from 'angular-plotly.js';
//
// PlotlyModule.plotlyjs = PlotlyJS;


import {NgxChartsModule} from '@swimlane/ngx-charts';
// import { HeatMapChartComponent } from './heat-map-chart/heat-map-chart.component';
// import { GaugeChartComponent } from './gauge-chart/gauge-chart.component';
// import { PolarRadarChartComponent } from './polar-radar-chart/polar-radar-chart.component';
// import { LinearGaugeChartComponent } from './linear-gauge-chart/linear-gauge-chart.component';
// import { NumberCardChartComponent } from './number-card-chart/number-card-chart.component';
// import { TreeMapChartComponent } from './tree-map-chart/tree-map-chart.component';
// import { BubbleChartComponent } from './bubble-chart/bubble-chart.component';
// import { ProductBarChartsComponent } from './product-bar-charts/product-bar-charts.component';
// import { ProductPieChartsComponent } from './charts/product-pie-charts/product-pie-charts.component';
// import { ProductAreaLineChartsComponent } from './product-area-line-charts/product-area-line-charts.component';

@NgModule({
    declarations: [
        AppComponent,
        LoadNewComponent,
        CopyDirComponent,
        DataFileConfigComponent,
        AnalysisParamsComponent,
        JsonTableComponent,
        SidebarMenuComponent,
        MainAppComponent,
        SingleTableContentComponent,
        MultiTableContentComponent,
        HomeComponent,
        RunScriptComponent,
        PythonConfigComponent,
        ConnectionComponent],

    imports: [
        HttpClientModule,
        ElectronModule,
        SharedModule,
        AppRoutingModule,
        MaterialModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        NgxChartsModule
        // PlotlyModule
    ],
    exports: [
        TranslateModule
    ],
    providers: [SystemConfigService, RunDataService],
    bootstrap: [AppComponent]
})

export class AppModule {
}
