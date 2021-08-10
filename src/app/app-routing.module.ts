import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { AuthGuardService } from './modules/core/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'products',
    loadChildren: () => import('./modules/product/products.module').then(m => m.ProductsModule),
    canActivate: [AuthGuardService]
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
