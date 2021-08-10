import { Injectable } from "@angular/core";
import {
  AngularFirestore,
} from "@angular/fire/firestore";
import * as firebase from "firebase";
import {
  filter,
  first,
  map,
  take,
} from "rxjs/operators";
import {
  AngularFireStorage,
} from "@angular/fire/storage";
import { BehaviorSubject } from "rxjs";

import { FormArray, FormGroup } from "@angular/forms";
import { AngularFireAuth } from "@angular/fire/auth";
import { FbError } from "src/app/modules/core/firebase.custom.errors.handler";
export class FileUpload {
  key?: string;
  name: string;
  url: string;
  file: File;

  constructor(file: File) {
    this.file = file;
  }
}

@Injectable()
export class FireStoreService {
  $pub: BehaviorSubject<any> = new BehaviorSubject(null)

  // Error handling has bee done globally in firebase.custom.errors.handlers.ts
  pub(event, data) {
    return this.$pub.next({ event, data });
  }
  async sub(str) {
    let sub = await this.$pub
      .asObservable()
      .pipe(
        take(1),
        filter((val) => val && val.event && val.event === str)
      )
      .toPromise();
    this.$pub.next(null);
    return sub;
  }
  constructor(
    private firestore: AngularFirestore,
    public storage: AngularFireStorage,
    public fa: AngularFireAuth
  ) { }

  async pushFileToStorage(files: FormArray, folder) {
    return await Promise.all(
      files.controls.map(async (e: FormGroup) => {
        if (!/^http/.test(e.value.url)) {
          const name = `${this.firestore.createId()}_${e.value.file.name
            }`.replace(/ /g, "_");
          const filePath = `${folder}/${name}`;
          const storageRef = this.storage.ref(filePath);

          const uploadTask = this.storage.upload(filePath, e.value.file);
          e.patchValue({
            progress: uploadTask.percentageChanges(),
            name,
          });
          e.updateValueAndValidity();
          await uploadTask.snapshotChanges().toPromise();
          e.patchValue({ url: await storageRef.getDownloadURL().toPromise() });
        }

        return Promise.resolve(e);
      })
    );
  }
  async getUserIDAsync() {
    const user = await this.fa.authState.pipe(first()).toPromise();
    return user.uid;
  }

  async updateProduct({ id, category, ...data }: any) {

    let product: any = await this.firestore
      .collection("products")
      .doc(id)
      .get()
      .pipe(take(1))
      .toPromise();
    product = { ...product.data(), ...data, category };
    await this.firestore.collection("products").doc(id).update(product);
    return;

  }
  async addProduct(data) {

    const list = await this.firestore.collection("products").add(data);
    return list;

  }

  async deleteProduct({ id, images }) {
    await Promise.all(
      images.map(async (img) => {
        return await this.deleteFileStorage(img.name, img.baseUrl);
      })
    );
    return await this.firestore.collection("products").doc(id).delete();
  }

  getProductCategories() {
    return this.firestore
      .collection("product_category")
      .snapshotChanges()
      .pipe(map((actions) => actions.map(this.extract)));
  }
  getProducts() {

    return this.firestore
      .collectionGroup("products")
      .snapshotChanges()
      .pipe(map((actions) => actions.map(this.extract)));
  }
  getUnits() {
    return this.firestore
      .collectionGroup("unit_types")
      .snapshotChanges()
      .pipe(map((actions) => actions.map(this.extract)));
  }

  deleteDocumentArrayIndex(collectionName, id, index) {

    this.firestore
      .collection(collectionName)
      .doc(id)
      .update({ [index]: firebase.default.firestore.FieldValue.delete() });

  }
  deleteFileStorage(name: string, baseUrl: string): void {

    const storageRef = this.storage.ref(baseUrl);
    storageRef.child(name).delete();
  }
  private extract(a) {

    const data: any = a.payload.doc.data();
    data.id = a.payload.doc.id;
    return data;

  }

  // helpler function for deletion of images from storage and firesotre both
  async onDeleteImageHandler(form, field, collection, index) {
    let img: any = (form.get(field) as FormArray).get(index.toString());

    if (form.value.id) {
      //edit mode: delete from firestore
      try {
        await this.deleteDocumentArrayIndex(
          collection,
          form.value.id, // doc id
          index
        );
      } catch (error) {
        throw new FbError('Firebase onDeleteImageHandler ', 'Firebase', error)
      }
      if (!img.value.file) {
        // delete from storage
        await this.deleteFileStorage(img.value.name, img.value.baseUrl);
      }
    }
    (form.get(field) as FormArray).removeAt(index);
  }
}
