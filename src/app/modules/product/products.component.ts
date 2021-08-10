import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FireStoreService } from '../../services/firestore/fire-store.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  
  $products: Observable<any>;
  constructor(
    private fss: FireStoreService,
    private router: Router, 
  ) {
    this.$products = this.fss.getProducts()
   }
   navigate(product: any) {
    this.fss.pub("product", product);
    this.router.navigateByUrl(`/products/form/${product.title}`, { state: { product } });
  }
  ngOnInit(): void {
  }

}
