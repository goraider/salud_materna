import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { PermissionsRoutingModule } from './pacientes-routing.module';
import { ListComponent } from './list/list.component';
import { MatPaginatorIntl, MatDatepickerModule, MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material';
import { getEspPaginatorIntl } from 'src/app/esp-paginator-intl';
import { FormComponent } from './form/form.component';
import { DetailsComponent } from './details/details.component';
//import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';


@NgModule({
  declarations: [ListComponent, FormComponent, DetailsComponent],
  imports: [
    CommonModule,
    PermissionsRoutingModule,
    SharedModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ],
  entryComponents:[
    FormComponent,
    DetailsComponent
  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
    
  ]
})
export class PacientesModule { }
