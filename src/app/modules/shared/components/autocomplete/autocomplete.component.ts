import {
  Component,
  Directive,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from "@angular/core";
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { isObservable } from "rxjs";


@Directive({ selector: '[rowSelector]' })
export class ChildDirective {

}

@Component({
  selector: "autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ["./autocomplete.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true,
    },
  ],
})
export class AutocompleteComponent
  implements ControlValueAccessor, OnInit, OnChanges {
  @ViewChildren(ChildDirective) rows!: QueryList<ChildDirective>;
  constructor(public fb: FormBuilder) { }
  unsub: any = [];
  @Input() options: any = {
    select: "id",
    show: "name",
  };
  get selector() {
    return this.options.select;
  }
  data: any = [];
  onChange = (quantity) => { };
  onTouched = () => { };
  touched = false;
  disabled = false;
  openDropdown = false;

  form = this.fb.group({
    input: "",
    select: "",
  });

  get input() {
    return this.form.get("input") as FormControl;
  }

  searchFilter = {
    filterType: "filterByProp",
    filter: [{ displayName: this.input?.value || "" }],
  };
  value_ = ''
  writeValue(value: any) {
    this.value_ = value;
    if (this.data.length) {
      let temp = this.data.filter(el => el.id === value);
      if (temp.length) this.input.patchValue(temp[0].displayName)
    }

  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }



  ngOnChanges({
    options: {
      currentValue: { data },
    },
  }: SimpleChanges) {
    if (isObservable(data)) {
      data.subscribe((d) => {
        this.data = d;
      });
    } else this.data = data;
  }

  onFocusEvent(e) {
    if (!this.openDropdown) {
      this.openDropdown = true;
    }
  }

  onChildClick(val) {
    this.onChange(val.uid);
    this.input.patchValue(val.displayName);
    this.openDropdown = false;
  }
  ngOnInit() {
    this.input.valueChanges.subscribe((val) => {
      this.searchFilter.filter[0].displayName = val;
    });
    this.form.valueChanges.subscribe(this.onTouched);

  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
