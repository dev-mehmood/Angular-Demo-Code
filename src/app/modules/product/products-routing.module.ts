import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProductsFormComponent } from "./products-form/products-form.component";
import { ProductsComponent } from "./products.component";

const routes: Routes = [
  {
    path: '', component: ProductsComponent
  },
  {
    path: 'form',
    pathMatch: 'full',
    component: ProductsFormComponent,
  },
  {
    path: 'form/:id',
    pathMatch: 'full',
    component: ProductsFormComponent,
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
