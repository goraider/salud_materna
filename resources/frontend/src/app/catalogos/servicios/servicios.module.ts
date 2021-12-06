import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { ServiciosRoutingModule } from './servicios-routing.module';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getEspPaginatorIntl } from 'src/app/esp-paginator-intl';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
//import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';


@NgModule({
  declarations: [ListComponent, FormComponent],
  imports: [
    CommonModule,
    ServiciosRoutingModule,
    SharedModule
  ],
  entryComponents:[
    FormComponent,
  ],
  providers:[
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ]
})
export class ServiciosModule { }
