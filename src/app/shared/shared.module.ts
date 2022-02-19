import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective, MatTableResponsiveDirective, DecimalPlacesDirective} from './directives/';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, MatTableResponsiveDirective, DecimalPlacesDirective],
  imports: [CommonModule, TranslateModule, FormsModule],
  exports: [TranslateModule, WebviewDirective, FormsModule, MatTableResponsiveDirective, DecimalPlacesDirective]
})
export class SharedModule {}
