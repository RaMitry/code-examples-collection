import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, withLatestFrom, first
  } from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AppState } from '../reducers';
import { allUserPlanLoaded } from '../selectors/users-plan.selector';
import { UserPlanService } from '../../_services/users-plan.service';
import { LoadAllUserPlans, RequestAllUserPlans, RefreshAllUserPlans,
  UserPlanActionTypes, CancelLoadUserPlans } from '../actions/users-plan.actions';

@Injectable()
export class UserPlanEffects {

  @Effect()
  loadAllPlans$ = this.actions$
  .pipe(
    ofType<RequestAllUserPlans>(UserPlanActionTypes.RequestAllUserPlans),
    withLatestFrom(this.store.pipe(first(), select(allUserPlanLoaded))),
    filter(([allShifstLoaded]) => !allShifstLoaded),
    mergeMap(([action]) =>
    this.userPlanService.findAllUserPlan(action.payload.dateRange)
      .pipe(
        catchError(err => {
          this.snackBar.open('An error has occured while trying to load the data', 'Ok', {
            duration: 2000,
          });
          this.store.dispatch(new CancelLoadUserPlans());
          return of([]);
        })
      )
    ),
    map(userPlanData => new LoadAllUserPlans({userPlanData})),
  );

  @Effect()
  refreshAllPlans$ = this.actions$
  .pipe(
    ofType<RefreshAllUserPlans>(UserPlanActionTypes.RefreshAllUserPlans),
    mergeMap(({payload}) => this.userPlanService.findAllUserPlan(payload.dateRange)
      .pipe(
        catchError(err => {
          this.snackBar.open('An error has occured while trying to load the data', 'Ok', {
            duration: 2000,
          });
          this.store.dispatch(new CancelLoadUserPlans());
          return of([]);
        })
      )
    ),
    map(userPlanData => new LoadAllUserPlans({userPlanData}))
  );


  constructor(
    private actions$: Actions,
    private userPlanService: UserPlanService,
    private store: Store<AppState>,
    public snackBar: MatSnackBar
  ) { }
}
