import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { timer, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';

import { CustomerLocationDataServiceAbstract } from '../../_services/abstract/customerLocation.data.service.abstract';
import { EventDataServiceAbstract } from '../../_services/abstract/event.data.service.abstract';
import { DatasyncService } from '../../_services/datasync.service';
import { MatSnackBar } from '@angular/material';
import { CanComponentDeactivate } from '../../_services/pending-changes-guard.service';
import { EventDto } from '../../_models/persistence.dto';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.sass']
})
export class AddEventComponent implements OnInit, CanComponentDeactivate, OnDestroy {

  @ViewChild('addEventForm') addEventForm: NgForm;
  companyIconPath: string;

  activeDisposal: any;
  activeEvent: any;
  disposalCustomerLocation: any;
  selectedActyvityType: string;
  eventTypes = [{val: 1, description: 'Layout'},
    {val: 2, description: 'Profiles'},
    {val: 3, description: 'Delivery'},
    {val: 4, description: 'Explosion'},
    {val: 5, description: 'Other'}
  ];
  isEventFormDirty = true;
  duration = 2000;

  eventTypeId: number;
  selectedDate: Date;
  selectedTime: Date;
  eventNotes: any[];
  isTentative: boolean;
  eventCreationStatus: boolean;

  subscriptionToNewEventCreationStatus: Subscription;
  componentSelector;

  constructor(
    private customerLocationService: CustomerLocationDataServiceAbstract,
      private eventService: EventDataServiceAbstract,
      private Route: ActivatedRoute,
      private router: Router,
      public snackBar: MatSnackBar,
      private dataSync: DatasyncService) {
      this.companyIconPath = environment.icon_route;
  }

  async ngOnInit() {
    this.dataSync.setSplitUIState(false);
    this.activeDisposal = this.Route.snapshot.data['disposalItem'];
    this.activeEvent = this.Route.snapshot.data['eventItem'];

    this.disposalCustomerLocation = await this.customerLocationService.getLocationById(this.activeDisposal.customerLocationId);
    this.subscriptionToNewEventCreationStatus = this.dataSync.newEventCreation.subscribe(
      newEventCreationStatus => {this.eventCreationStatus = newEventCreationStatus;
    });

    if (this.activeEvent) {
      this.eventTypeId = this.activeEvent.eventType;
      this.selectedDate = this.activeEvent.date.split('T')[0];
      this.selectedTime = this.activeEvent.date.split('T')[1];
      this.eventNotes = this.activeEvent.eventNotes;
    }
  }

  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    if (this.isEventFormDirty && this.addEventForm.dirty) {
      return false;
    } else {
      return true;
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Ok', {
      duration: this.duration,
    });
  }

  public checkDate(selectedDate): void {
    if (selectedDate <= Date.now()) {
      this.openSnackBar('Selected date might have already passed.');
    }
  }

  public checkTime(selectedTime): void {
    if (selectedTime.getHours() >= 16) {
      this.openSnackBar('Selected time might be later than intended.');
    }
  }

  async onAddEvent(form: NgForm) {
    this.isEventFormDirty = false;
    const formData = form.value;
    const startDate = formData.date.toISOString().split('T')[0];
    const startTime = formData.time.toISOString().split('T')[1];
    const time = startDate + 'T' + startTime;
    const newEventData = new EventDto ({ date: time});
    let newEvent = new EventDto ({ ...newEventData, disposalId: this.activeDisposal.id, eventStateType: 1,
      eventType: formData.type, id: null, isTentative: this.isTentative});
    if (this.activeEvent) {
      newEvent = new EventDto ({...newEvent, id: this.activeEvent.Id});
    }
    if (formData.notes) {
      newEvent = new EventDto ({ ...newEvent, eventNotes: (this.eventNotes) ?
        [ ...this.eventNotes,
          {
            'userId': 'user name from create',
            'notes': formData.notes
          }
        ] :
        [
          {
            'userId': 'user name from create',
            'notes': formData.notes
          }
        ]
      });
    }
    const adddEventResult = this.eventService.updateEvent(newEvent);
    if ( adddEventResult) {
      await this.dataSync.refreshCurrentDisposalEventsData(this.activeDisposal.id);
      this.dataSync.changeEventCreationStatus(false);
      this.openSnackBar('The event was added!');
      timer(1200).subscribe(x => this.router.navigate([`/disposals/${this.activeDisposal.id}`]));
    }
  }

  cancel() {
    if (this.eventCreationStatus) {
      this.router.navigate([`/disposals`]);
    } else {
      this.router.navigate([`/disposals/${this.activeDisposal.id}`]);
    }
  }

  ngOnDestroy() {
    this.subscriptionToNewEventCreationStatus.unsubscribe();
  }
}
