import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';

import { AppState } from '../../_store/reducers/index';
import { isLoggedOut } from '../../_store/selectors/auth.selector';
import { AuthService } from '../auth.service';

@Injectable()
export class LoginPageGuard implements CanActivate {

  constructor (
    private store: Store<AppState>,
    private router: Router,
    public auth: AuthService
  ) { }

  canActivate(): Observable<boolean>  {

    return this.store
      .pipe(
        select(isLoggedOut),
        tap(LoggedOut => {

          if (!LoggedOut) {
            this.auth.tokenExpirationCheckTimer(60 * 1000);
            this.router.navigateByUrl('/dashboard');
          }

        })
    );

  }

}
