import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from "@angular/core";
import { FormArray } from "@angular/forms";
import { FireStoreService } from "../../../../services/firestore/fire-store.service";
import { FormBuilder } from "@angular/forms";
import { of } from "rxjs";

@Component({
  selector: "app-img-uploader",
  templateUrl: "./img-uploader.component.html",
  styleUrls: ["./img-uploader.component.scss"],
})
export class ImgUploaderComponent implements OnChanges {
  @Input() form: FormArray;
  @Output("files") onFile = new EventEmitter();
  @Output("delete") onDelete = new EventEmitter();
  constructor(private fss: FireStoreService, private fb: FormBuilder) {}
  submit() {
    this.onFile.emit(this.form);
  }
  isLoading: boolean = false;
  showSubmit = false;
  async showPreview(event) {
    const files: any = (event.target as HTMLInputElement).files;
    this.isLoading = true;
    await Promise.all(
      Array.from(files).map(async (file: any) => {
        function readFile() {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            console.log(this);
            reader.onload = (e) => {
              let form_ = this.fb.group({
                file,
                name: file.name,
                url: reader.result as string,
                progress: of(10),
              });
              this.form.push(form_);
              resolve(form_);
            };
            reader.readAsDataURL(file);
          });
        }

        return readFile.bind(this)();
      })
    );
    this.isLoading = false;
    this.form.updateValueAndValidity();
  }
  removeImage(index) {
    this.onDelete.emit(index);
  }

  ngOnChanges() {
    this.showSubmit = this.form ? false : true;
    this.form = this.form || this.fb.array([]);
  }
}
