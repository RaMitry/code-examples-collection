import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';

import { AppState } from '../../_store/reducers/index';
import { isLoggedIn } from '../../_store/selectors/auth.selector';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor (
    private store: Store<AppState>,
    private router: Router,
    public auth: AuthService
  ) { }

    canActivate(): Observable<boolean>  {

    return this.store
      .pipe(
        select(isLoggedIn),
        tap(loggedIn => {

          if (!loggedIn) {
            this.router.navigateByUrl('/login');
          } else {
            this.auth.tokenExpirationCheckTimer(60 * 1000);
          }

        })
    );

  }

}
