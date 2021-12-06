import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';

import { MonitoreoComponent } from './monitoreo/monitoreo.component';



const routes: Routes = [
  { path: 'concentrados/reporte-monitoreo', component: MonitoreoComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitoreoRoutingModule { }
