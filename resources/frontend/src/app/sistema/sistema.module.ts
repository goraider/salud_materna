import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SistemaRoutingModule } from './sistema-routing.module';
import { PacientesModule } from './pacientes/pacientes.module';

import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    SistemaRoutingModule
  ],
  exports: [
    PacientesModule,
  ]
})
export class SistemaModule { }
