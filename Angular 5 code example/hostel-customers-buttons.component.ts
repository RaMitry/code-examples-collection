import { Component, Injector, Output, EventEmitter, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HostelCustomersComponent } from './hostel-customers.component';

@Component({
    selector: 'hostelCustomersButtons',
    templateUrl: './hostel-customers-buttons.component.html',
    styleUrls: ['./hostel-customers-buttons.component.less']
})

export class HostelCustomersButtonsComponent extends AppComponentBase {

    @Input() displayFilters: boolean;    
    @Input() paginateCustomers: boolean;
    @Input() displaySchedule: boolean;
    @Input() displaySendEmail: boolean;
    @Input() displaySendSms: boolean;

    @Output() toogleRightBlockEvent = new EventEmitter<any>();
    @Output() togglePaginateCustomersDataEvent = new EventEmitter();
    @Output() toogleDisplayColumnsFiltersRowEvent = new EventEmitter();

    constructor(injector: Injector, 
                private hostelCustomersComponent: HostelCustomersComponent) {
        super(injector);
    }    

    exportAllTableDataToCSV() {
        this.hostelCustomersComponent.exportAllTableDataToCSV();
    }

    toogleDisplayColumnsFiltersRow(): void {
        this.toogleDisplayColumnsFiltersRowEvent.emit();
    }

    togglePaginateCustomersData(): void {
        this.togglePaginateCustomersDataEvent.emit();
    }    

    toogleDisplayScheduleBlock(): void {
        this.toogleRightBlockEvent.emit({visibility: !this.displaySchedule, variableName: 'displaySchedule'});
    }   

    toogleDisplayEmailBlock(): void {
        this.toogleRightBlockEvent.emit({visibility: !this.displaySendEmail, variableName: 'displaySendEmail'});
    }

    toogleDisplaySmsBlock(): void {
        this.toogleRightBlockEvent.emit({visibility: !this.displaySendSms, variableName: 'displaySendSms'});
    }
}