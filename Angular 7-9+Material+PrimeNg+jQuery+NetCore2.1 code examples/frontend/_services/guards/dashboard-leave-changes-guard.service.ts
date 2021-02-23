import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable, Subscription, Observer } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { Store } from '@ngrx/store';

import { AppState } from '../../_store/reducers';
import { Logout } from '../../_store/actions/auth.actions';
import { AuthService } from '../../_services/auth.service';

export interface CanComponentDeactivate {
 canDeactivate: () => Observable<boolean> | boolean | Promise<boolean>;
 unsavedComponentTitle: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardLeaveChangesGuardService implements CanDeactivate<CanComponentDeactivate> {

  isWindowDataChangedSubscription$: Subscription;
  isWindowDataChanged$;

  constructor(
    private confirmationService: ConfirmationService,
    public auth: AuthService,
    private store: Store<AppState>
    ) {
  }

  canDeactivate(component: CanComponentDeactivate) {

    if (component.canDeactivate() || this.auth.checkIfTokenExpired()) {
      this.store.dispatch(new Logout());
      return true;
    } else {
      return Observable.create((observer: Observer<boolean>) => {
        this.confirmationService.confirm({
            message: `'${component.unsavedComponentTitle}' window have unsaved changes. Are you sure you want to leave?`,
            accept: () => {
                this.store.dispatch(new Logout());
                observer.next(true);
                observer.complete();
            },
            reject: () => {
                observer.next(false);
                observer.complete();
            }
        });
      });
    }
  }
}
