import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { CatalogosComponent } from './catalogos.component';

const routes: Routes = [
  { path: 'catalogos', component: CatalogosComponent, canActivate: [AuthGuard] },

  // {path:'catalogos', redirectTo:'catalogos/diagnosticos', pathMatch:'full'},
  // {path:'catalogos', redirectTo:'catalogos/servicios',    pathMatch:'full'},
  // {path:'catalogos', redirectTo:'catalogos/estados-actuales',    pathMatch:'full'}

  //esta ruta redirecciona al primer catalogo que se visualiza en pantalla
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogosRoutingModule { }
