import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogosRoutingModule } from './catalogos-routing.module';
//import { PacientesModule } from './pacientes/pacientes.module';

import { DiagnosticosModule } from './diagnosticos/diagnosticos.module';
import { ServiciosModule } from './servicios/servicios.module';
import { EstadosActualesModule } from './estados-actuales/estados-actuales.module';

import { CatalogosComponent } from './catalogos.component';

//DiagnosticosComponent


@NgModule({
  declarations: [CatalogosComponent],
  imports: [
    CommonModule,
    CatalogosRoutingModule
  ],
  exports: [
    DiagnosticosModule,
    ServiciosModule,
    EstadosActualesModule,
  ]
})
export class CatalogosModule { }
