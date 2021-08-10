import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { MaterialModule } from 'src/app/material.module';
import { StoreModule } from '@ngrx/store';
import { authenticationFeatureKey } from 'src/app/store/auth/auth.state';
import { authReducer } from 'src/app/store/auth/auth.reducers';
import { ProductsRoutingModule } from './products-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { FireStoreService } from 'src/app/services/firestore/fire-store.service';
import { ProductsFormComponent } from './products-form/products-form.component';
import { ProductsFormModule } from './products-form/products-form.module';
import { ModalModule } from "ngx-bootstrap/modal";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
@NgModule({
  declarations: [ProductsComponent, ProductsFormComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
    ProductsFormModule,
    MaterialModule,
    SharedModule,
    ModalModule.forRoot(),
    MatProgressSpinnerModule,
    StoreModule.forFeature(authenticationFeatureKey, authReducer),
  ],
  providers: [
    FireStoreService,
  ]
})
export class ProductsModule { }
