
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConcentradosRoutingModule } from './concentrados-routing.module';
import { MonitoreoModule } from './reporte-monitoreo/monitoreo.module'
import { ReporteAltasModule } from './reporte-altas/reporte-altas.module'

import { ConcentradosComponent } from './concentrados.component';

@NgModule({
  declarations: [ConcentradosComponent],
  imports: [
    CommonModule,
    ConcentradosRoutingModule
  ],
  exports: [
    MonitoreoModule,
    ReporteAltasModule

  ]
})
export class ConcentradosModule { }

