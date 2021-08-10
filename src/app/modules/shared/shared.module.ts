import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckBoxesComponent } from './components/check-boxes/check-boxes.component';
import { ImgUploaderComponent } from './components/img-uploader/img-uploader.component';
import { FireStoreService } from 'src/app/services/firestore/fire-store.service';
import { MultiFilterPipe } from './pipes/filter-by-prop.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    CheckBoxesComponent,
    ImgUploaderComponent,
    MultiFilterPipe,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  providers: [
    FireStoreService,
  ],
  exports: [
    CheckBoxesComponent,
    ImgUploaderComponent,
    FireStoreService,
    MultiFilterPipe,
  ]
})
export class SharedModule { }
