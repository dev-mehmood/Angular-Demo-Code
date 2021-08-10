
import {
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { FormArray, FormBuilder } from "@angular/forms";
import { Observable, of } from "rxjs";
export interface ChexBoxesOptions   {
  
  lable: string;
  [key: string]: any;
  form: FormArray;
  formData: Observable<any>;
  pipeName: string;
  withSearch?: boolean;
  searchFilter?: {
    filterType?: "filterByProp" | "filterIfAnyIsTrue" | "filterIfAllAreTrue";
    filter:
      | {
          [key: string]: string;
        }
      | [{ [key: string]: string }];
  };
}
@Component({
  selector: "app-check-boxes",
  templateUrl: "./check-boxes.component.html",
  styleUrls: ["./check-boxes.component.scss"],
})
export class CheckBoxesComponent implements OnInit {
  @Input() options: ChexBoxesOptions = {
    form: this.fb.array([]),
    lable: "Data",
    formData: of([]),
    pipeName: "filterByProp",
    searchFilter: {
      filter: [{ title: "" }],
    },
  };
  form: FormArray;

  constructor(public fb: FormBuilder) {}

  ngOnInit(): void {
    this.options.form = this.options.form || this.fb.array([]);
  }
  onChange(e) {
    if (e.target.checked) {
      this.options.form.push(this.fb.control(e.target.value));
    } else {
      let index = this.options.form.controls.findIndex(
        (ct) => ct.value == e.target.value
      );
      this.options.form.removeAt(index);
    }
    this.setErrors();
  }

  private setErrors() {
    if (!this.options.form.controls.length) {
      this.options.form.setErrors({
        required: true,
      });
    } else {
      this.options.form.setErrors(null);
    }
    if (!this.options.form.dirty) {
      this.options.form.markAsDirty();
    }
  }
}
