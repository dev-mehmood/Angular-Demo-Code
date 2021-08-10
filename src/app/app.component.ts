import { Component } from '@angular/core';
import ILoggedInUser from './models/auth/ILoggedInUser';
import { select, Store } from '@ngrx/store';
import { appBootEvent } from './store/auth/auth.actions';
import { Observable } from 'rxjs';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Ngrx-Demo';
  auth$: Observable<ILoggedInUser>;
  constructor(private store: Store<{ authenticatedUser: ILoggedInUser }>, 
    public afAuth: AngularFireAuth,
    public router: Router
    ) {
    this.store.dispatch(appBootEvent())
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.auth$ = this.store.pipe(select('authenticatedUser'))
  }

  logout() {

    this.afAuth.signOut().then(() => {
      window.location.reload();
    })
  }

}



