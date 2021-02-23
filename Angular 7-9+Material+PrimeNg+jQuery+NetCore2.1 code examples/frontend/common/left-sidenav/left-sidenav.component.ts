import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { AppState } from '../../_store/reducers';

@Component({
  selector: 'app-left-sidenav',
  templateUrl: './left-sidenav.component.html',
  styleUrls: ['./left-sidenav.component.scss']
})
export class LeftSidenavComponent implements OnInit {

  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() toggleSchedule = new EventEmitter<void>();
  @Output() toggleEvents = new EventEmitter<void>();
  @Input() sidenavIconMode: boolean;

  constructor(
    private store: Store<AppState>,
    public snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  togglePlanAssign() {
    this.toggleSchedule.emit();
  }

  toggleEventsPortal() {
    this.toggleEvents.emit();
  }

  toggleSidenavMode() {
    this.toggleSidenav.emit();
  }

  logout() {
    this.router.navigateByUrl('/login');
  }

}
