import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '../../_modules/material.module';
import { StoreModule } from '@ngrx/store';
import { AppRoutingModule } from '../../app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';

import { LeftSidenavComponent } from './left-sidenav.component';
import { DashboardIndexComponent } from '../../dashboard/dashboard-index/dashboard-index.component';
import { LoginComponent } from '../../auth/login/login.component';

describe('LeftSidenavComponent', () => {
  let component: LeftSidenavComponent;
  let fixture: ComponentFixture<LeftSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        StoreModule.forRoot({})
      ],
      declarations: [
        LeftSidenavComponent,
        DashboardIndexComponent,
        LoginComponent
      ],
      providers: [
        {
          provide: APP_BASE_HREF,
          useValue: '/'
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
