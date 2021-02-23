import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { EventDataServiceAbstract } from './abstract/event.data.service.abstract';

@Injectable({
  providedIn: 'root'
})
export class DatasyncService {  

  private splitUIState = new BehaviorSubject<boolean>(false);
  splitUI = this.splitUIState.asObservable();

  private newEventCreationStatus = new BehaviorSubject<boolean>(false);
  newEventCreation = this.newEventCreationStatus.asObservable();

  private currentOrderActivitiesData = new BehaviorSubject(undefined);
  disposalActivitiesData = this.currentOrderActivitiesData.asObservable();


  constructor(
    private eventService: EventDataServiceAbstract
  ) { }
  

  setSplitUIState(selector) {
    this.splitUIState.next(selector);
  }

  changeEventCreationStatus(newStatus) {
    this.newEventCreationStatus.next(newStatus);
  }

  async refreshCurrentOrderActivitiesData(disposalId) {
    this.eventService.getActivitiesByOrderId(disposalId).subscribe((events: any[]) => {
      this.currentOrderActivitiesData.next(events);
    });
  }
}
