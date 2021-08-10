import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  Validators, 
} from "@angular/forms";
import { Observable } from "rxjs";
import {
  ProductList,
} from "../../../models/interfaces/sari-dukan-form-interface";
import firebase from "firebase/app";
firebase.firestore.FieldValue.serverTimestamp();
import { FireStoreService } from "../../../services/firestore/fire-store.service";
import { Router } from "@angular/router";
import { ModalDirective } from "ngx-bootstrap/modal";

@Component({
  selector: "app-products-form",
  templateUrl: "./products-form.component.html",
  styleUrls: ["./products-form.component.scss"],
})
export class ProductsFormComponent implements OnInit, AfterViewInit {
  $products: Observable<ProductList[]>;
  isLoading = false;
  fileAttr = "Choose File";
  filtername = "filterByProp";
  search = this.fb.group({
    category: "",
  });

  $productCategories: Observable<any>;
  $unitTypes: Observable<any>;

  constructor(
    private router: Router,
    public fb: FormBuilder,
    private fss: FireStoreService
  ) {
    
    this.$unitTypes = this.fss.getUnits();
    this.$products = this.fss.getProductCategories();
    this.$productCategories = this.fss.getProductCategories();
  }
  
  product = this.fb.group({
    id: "",
    title: [null, [Validators.required]],
    unit_type: [null, [Validators.required]],
    category: this.fb.array([], Validators.required), // product_category
    description: [null],
    created_by: [null],
    images: this.fb.array([], [Validators.required]),
    last_unit_price: [null,[Validators.required]],
  });

  get form() {
    return this.product.controls;
  }
  get category() {
    return this.product.get("category") as FormArray;
  }

  ngOnInit(): void {}

  get images() {
    return this.product.get("images") as FormArray;
  }

  private async prepareEditForm() {
    let product = await this.fss.sub("product");
    if (product) {
      product = product.data;

      product.category.forEach((element) => {
        this.category.push(this.fb.control(""));
      });    

      product.images &&
        product.images.forEach(({ url, name, baseUrl }) => {
          this.images.push(
            this.fb.group({
              url,
              name,
              progress: 0,
              file: null,
              baseUrl,
            })
          );
        });
      this.product.patchValue(product);
      this.product.updateValueAndValidity();
    }
  }

  ngAfterViewInit() {
    this.prepareEditForm();
  }

  async onSubmit() {
    this.isLoading = true;
    await this.fss.pushFileToStorage(this.images, "products");
    const data = this.product.value;
    data.images.length &&
      (data.images = data.images.map((m) => {
        delete m.progress;
        delete m.file;
        m.baseUrl = `products`;
        return m;
      })); // shop form save or update
    if (!this.product.value.id) {
      data.created_at = firebase.firestore.FieldValue.serverTimestamp();
      data.created_by = await this.fss.getUserIDAsync();
    }

    this.product.value.id
      ? await this.fss.updateProduct(data)
      : await this.fss.addProduct(data);

    this.isLoading = false;
    this.router.navigate(["products"]);
  }

  async onDeleteImage(index) {
    await this.fss.onDeleteImageHandler(
      this.product,
      "images",
      "products",
      index
    );
  }
  @ViewChild('confirm') public confDelete: ModalDirective;
  async deleteProduct() {

    
    await this.fss.deleteProduct(this.product.value);
    this.confDelete.hide();
    this.router.navigateByUrl('products')
  }

}
