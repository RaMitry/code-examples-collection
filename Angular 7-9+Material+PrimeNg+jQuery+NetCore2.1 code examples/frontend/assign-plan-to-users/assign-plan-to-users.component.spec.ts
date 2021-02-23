import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { MaterialModule } from '../_modules/material.module';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { authReducer } from '../_store/reducers/auth.reducer';
import { changesReducer } from '../_store/reducers/changes.reducer';
import { userPlanReducer } from '../_store/reducers/users-plan.reducer';

import { AssignPlanToUsersComponent } from './assign-plan-to-users.component';

describe('AssignPlanToUsersComponent', () => {
  let component: AssignPlanToUsersComponent;
  let fixture: ComponentFixture<AssignPlanToUsersComponent>;
  let debugElement: DebugElement;
  let _SelectWeekTitleEl: HTMLElement;
  const _assignPlanToUsersArray = [
    [
      {
        'fullName': 'David Schimerman',
        'info': 'Works super!'
      },
      '2',
      '2',
      '2',
      '2',
      '2',
      '2',
      '2',
      2
    ],
    [
      {
        'fullName': 'Scott Michigan',
        'info': 'Works magnificient'
      },
      '3',
      '3',
      '3',
      '3',
      '2',
      '2',
      '2',
      3
    ]
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        StoreModule.forRoot({
          auth: authReducer,
          windowsChanges: changesReducer,
          userPlan: userPlanReducer
        }),
        HttpClientModule,
        BrowserAnimationsModule
      ],
      declarations: [ AssignPlanToUsersComponent ],
      providers: [
        DatePipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPlanToUsersComponent);
    fixture.componentInstance.assignPlanToUsersArray = _assignPlanToUsersArray;
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    _SelectWeekTitleEl = fixture.debugElement.query(By.css('.select-week-placeholder')).nativeElement;
    fixture.detectChanges();
  });

  it('Display Select week title', () => {
    fixture.detectChanges();
    expect(_SelectWeekTitleEl.textContent).toContain('Select week');
  });

  it('should have plan names array', () => {
    const planNamesArray = component.planNamesArray;
    expect(planNamesArray).toEqual(['OFF', 'DAY', 'AFTN', 'NIGHT']);
  });

  it('should have Agents as a title of a first column', () => {
    fixture.whenStable().then(() => {
      const UserNameColumnTitle = debugElement.query(By.css('th')).nativeElement.innerText;
      expect(UserNameColumnTitle).toContain('Agents');
    });
  });

  it('check if user name from data array is added to the table cell-button', () => {
    fixture.whenStable().then(() => {
      const firstUserNameElText = debugElement.query(By.css('button.full-name-button')).nativeElement.innerText;
      expect(firstUserNameElText).toEqual(_assignPlanToUsersArray[0][0]['fullName']);
    });
  });

  it('check if first user sunday plan is equak to data in plans array', () => {
    fixture.whenStable().then(() => {
      const firstUserSunBtnText = debugElement.query(By.css('button.user-plan-btn')).nativeElement.innerText;
      expect(firstUserSunBtnText).toEqual(_assignPlanToUsersArray[0][1]);
    });
  });

  it('check change plan order', () => {
    fixture.whenStable().then(() => {
      const firstUserSunBtn = debugElement.query(By.css('button.user-plan-btn'))
      const firstUserSunPlanIndex = parseInt(<string>_assignPlanToUsersArray[0][1], 10);
      const newDayPlan = firstUserSunPlanIndex > 1 ? ( firstUserSunPlanIndex === 2 ? 3 : 0)
      : ( firstUserSunPlanIndex === 0 ? 1 : 2);
      firstUserSunBtn.triggerEventHandler('click', null);

      fixture.detectChanges();
      const firstUserSunBtnClicked = debugElement.query(By.css('button.user-plan-btn'))
      const firstUserSunBtnClickedText = firstUserSunBtnClicked.nativeElement.innerText;
      const firstUserSunPlanClickedIndex = parseInt(firstUserSunBtnClickedText, 10);

      expect(firstUserSunPlanClickedIndex).toEqual(newDayPlan);
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
