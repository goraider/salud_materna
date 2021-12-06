import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorIntl, MatDatepickerModule, MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material';
import { getEspPaginatorIntl } from 'src/app/esp-paginator-intl';
import { ReporteAltasRoutingModule } from './reporte-altas-routing.module';
import { ReporteAltasComponent } from './altas/reporte-altas.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ReporteAltasComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatNativeDateModule,
    MatDatepickerModule,
    ReporteAltasRoutingModule
  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
    
  ]
})
export class ReporteAltasModule { }
