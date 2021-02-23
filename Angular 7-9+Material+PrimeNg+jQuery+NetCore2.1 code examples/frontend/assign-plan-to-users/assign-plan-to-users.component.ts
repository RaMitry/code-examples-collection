import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { select, Store } from '@ngrx/store';
import { AppState } from '../_store/reducers';
import { Subscription, Observable } from 'rxjs';
import { delay } from 'rxjs/operators' ;
import { MatSnackBar } from '@angular/material/snack-bar';

import { UserPlanData } from '../_models/user.model';
import {
  RequestAllUserPlans,
  RefreshAllUserPlans,
  UpdateAllUserPlans,
  CloseUserPlansWindow,
  RefreshUserPlansEntities,
} from '../_store/actions/users-plan.actions';
import { UpdateUserPlanChanges } from '../_store/actions/changes-detection.actions';
import { selectAllUserPlan, selectUserPlansLoading } from '../_store/selectors/users-plan.selector';
import { UserPlanService } from '../_services/users-plan.service';
import { selectUserPlanChanges } from '../_store/selectors/changes.selector';

declare var $: any;

@Component({
  selector: 'app-assign-plan-to-users',
  templateUrl: './assign-plan-to-users.component.html',
  styleUrls: ['./assign-plan-to-users.component.scss']
})
export class AssignPlanToUsersComponent implements OnInit, AfterViewInit, OnDestroy {

  assignPlanToUsersForm;
  dataSource;

  plansLoadingState$: Observable<boolean>;

  isWindowDataChanged$;
  isWindowDataChangedSubscription$: Subscription;

  initialPlanToUsersArray$;
  initialPlanToUsersArraySubscription$: Subscription;

  assignPlanToUsersArray = [];

  displayedColumns = ['agents', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  @ViewChild('assignPlanToUsersPaginator', { static: true }) assignPlanToUsersPaginator: MatPaginator;

  defaultDateRangeValues = [];
  dateRangeValues: Date[] = [null, null];

  planNamesArray = ['OFF', 'DAY', 'AFTN', 'NIGHT'];
  planNamesColorsArray = ['#757575', '#F9A825', '#FF8A65', '#9575CD'];

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    public snackBar: MatSnackBar,
    private userPlanService: UserPlanService
  ) {
    this.assignPlanToUsersForm = this.formBuilder.array([]);
  }

  ngOnInit() {

    setTimeout(() => {
      this.plansLoadingState$ = this.store.pipe(
        delay(0),
        select(selectUserPlansLoading));
    });

    this.setDefaultDateRangeValues();

    this.isWindowDataChangedSubscription$ = this.store.pipe(select(selectUserPlanChanges)).subscribe( (userPlanChanges) => {
      this.isWindowDataChanged$ = userPlanChanges;
    });

    this.store.dispatch(new RequestAllUserPlans({dateRange: this.dateRangeValues}));

    this.setInitialPlanToUsers();

  }

  setDefaultDateRangeValues() {
    const defStart = new Date();
    defStart.setDate(defStart.getDate() - defStart.getDay());
    this.dateRangeValues[0] = defStart;

    const defEnd = new Date(defStart);
    defEnd.setDate(defStart.getDate() + 6);
    this.dateRangeValues[1] = defEnd;

  }

  setInitialPlanToUsers() {
    // we use an NGRX selector to select the users plans from the store und subscribe to their updates in the ngrx store.
    this.initialPlanToUsersArraySubscription$ = this.store.pipe(select(selectAllUserPlan)).subscribe( (initialArray$) => {
      
      this.initialPlanToUsersArray$ = initialArray$.slice();
      this.assignPlanToUsersArray = [];

      // transforming users plans data from the server to the appropriative data array for the users plans table
      this.initialPlanToUsersArray$.map( (item, rowIndex) => {
        this.assignPlanToUsersArray[rowIndex] = [];
        this.assignPlanToUsersArray[rowIndex][0] = item.userData;
        item.weekArr.map( (cellItem, cellIndex) => {
          this.assignPlanToUsersArray[rowIndex][cellIndex + 1] = cellItem;
        });
        this.assignPlanToUsersArray[rowIndex][8] = item.id;
      });

      this.dataSource = new MatTableDataSource<any>(this.assignPlanToUsersArray);
      this.dataSource.paginator = this.assignPlanToUsersPaginator;

    });
  }

  ngAfterViewInit() {
    //
  }

  selectDate(evt) {

    const start = new Date(evt);
    start.setDate(start.getDate() - start.getDay());
    this.dateRangeValues[0] = start;

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    this.dateRangeValues[1] = end;

    // hide datepicker panel
    setTimeout(() => {
      $('.ng-trigger-overlayAnimation')
      .attr('style', 'z-index: 1001; vgisibility: visible; display: none; top:0px; left:0px; transform: translateY(0px); opacity: 1;');
    }, 200);

    this.refreshPlanChanges();
  }

  onDateInputFocus() {
    // show the datepicker panel
    setTimeout(() => {
      $('.ng-trigger-overlayAnimation')
      .attr('style', 'z-index: 1001; visibility: visible; display: block; top:0px; left:0px; transform: translateY(0px); opacity: 1;');
    }, 10);
  }

  // on changing plan value
  setPlan(rowIndex, dayIndex, dayPlan) {

    const rowIndexPlan = (this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize) + rowIndex;
    const newDayPlan = dayPlan > 1 ? ( dayPlan === 2 ? 3 : 0) : ( dayPlan === 0 ? 1 : 2);
    this.dataSource.data[rowIndexPlan][dayIndex] = newDayPlan;    
    const userPlanDataArr: UserPlanData[] = [];

    this.dataSource.data.map( (dataRow) => {
      userPlanDataArr.push({
        id: dataRow[8],
        dateRange: this.dateRangeValues,
        userData: dataRow[0],
        weekArr: dataRow.slice(1, 8).map((daySh) => parseInt(daySh, 10))
      });
    });
    
    this.store.dispatch(new RefreshUserPlansEntities({userPlanData: userPlanDataArr}));
    this.store.dispatch(new UpdateUserPlanChanges(true)); // dispatch UpdateUserPlanChanges changes with a true value
    // this value will be check when the user will leave the page to decide if he need to be notify about unsaved changes
  }

  refreshPlanChanges() {
    this.store.dispatch(new UpdateUserPlanChanges(false)); // set the changes to false to refresh plan data
    // without confirmation for unsaved changes
    this.store.dispatch(new RefreshAllUserPlans({dateRange: this.dateRangeValues}));
    // this.store.dispatch(new SetUserPlansWeekStart({dateRange: this.dateRangeValues}));
  }

  cancelBtnClick() {
    setTimeout(() => {
      const scheduleWindow = $('#schedule').find('.lwd-window-titlebar-close');
      setTimeout(() => {
        scheduleWindow.trigger('click');
      }, 10);
    }, 10);
  }

  clearPlanChanges() {
    this.store.dispatch(new UpdateUserPlanChanges(false));
    this.initialPlanToUsersArray$.map( (item, rowIndex) => {
      this.dataSource.data[rowIndex][0] = item.userData;
      item.weekArr.map( (cellData, columnIndex) => {
          this.dataSource.data[rowIndex][columnIndex + 1] = cellData;
      });
    });

  }

  savePlanChanges() {
    this.store.dispatch(new UpdateUserPlanChanges(false));
    const updatedPlanToUsersArray: UserPlanData[] = [];
    this.dataSource.data.map( (dataRow) => {
      updatedPlanToUsersArray.push({
        id: dataRow[8],
        dateRange: this.dateRangeValues,
        userData: dataRow[0],
        weekArr: dataRow.slice(1, 8)
      });
    });

    this.userPlanService
      .saveAllUserPlanUpdate(updatedPlanToUsersArray)
      .subscribe(
        () => {
          this.store.dispatch(new UpdateAllUserPlans({
            userPlanData: updatedPlanToUsersArray
          }));
          this.snackBar.open('The latest changes have been saved!', 'Ok', {
            duration: 2000,
          });
        }
      );
  }

  ngOnDestroy() {
    this.store.dispatch(new CloseUserPlansWindow());
    this.initialPlanToUsersArraySubscription$.unsubscribe();
    this.isWindowDataChangedSubscription$.unsubscribe();
  }

}
