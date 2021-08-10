import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LoginModule } from './modules/login/login.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AuthenticationEffects } from './store/auth/auth.effects';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { CoreModule } from './modules/core/core.module';
import { PwaService } from './services/pwa/pwa.service';
import { MaterialModule } from './material.module';
import { A11yModule } from '@angular/cdk/a11y';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ErrorHandlingModule} from './modules/core/firebase.custom.errors.handler';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule, 
    A11yModule,
    FormsModule,
    ReactiveFormsModule,
    LoginModule,
    AngularFireModule.initializeApp(environment.firebase, 'firebase-auth'),
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([AuthenticationEffects]),
    MaterialModule,
    MatFormFieldModule,
    ErrorHandlingModule.forRoot()
  
  ],
  providers: [PwaService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
