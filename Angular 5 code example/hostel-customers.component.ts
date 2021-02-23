import {Component, Injector, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { IHostelCustomerModel } from '@shared/AppInterfaces';
import { SelectItem } from 'primeng/primeng';
import { HostelDataService } from '@app/hostel/hostel-data.service';
import { Table } from 'primeng/table';

@Component({
    templateUrl: './hostel-customers.component.html',
    styleUrls: ['./hostel-customers.component.less'],
    animations: [appModuleAnimation()]
})

export class HostelCustomersComponent extends AppComponentBase implements OnInit, AfterViewInit {
    
    hostelCustomers: IHostelCustomerModel[];
    selectedHostelCustomers: IHostelCustomerModel[];
    cols: any[];
    rowsPerPage: number = 10;

    columnOptions: SelectItem[];
    rowIndexArray: Array<number> = [];

    displayAdvFilters: boolean = false;
    displayFilters: boolean = false;

    displayRightBlock: boolean = false;
    displaySchedule: boolean = false;
    displaySendEmail: boolean = false;
    displaySendSms: boolean = false;

    paginateCustomers: boolean = true;


    @ViewChild('tt') private hostelCustomersPTable: Table;
    
    constructor(injector: Injector, private hostelDataService: HostelDataService) {
        super(injector);
    }

    ngOnInit() {
        this.cols = this.hostelDataService.initialcustomerColumnsArray;
        this.hostelCustomers = this.hostelDataService.hostelCustomersData;
                
        this.columnOptions = [];
        for (let col of this.cols) {
            this.columnOptions.push({label: col.header, value: col});
        }

    }

    ngAfterViewInit() {
        let hostelCustomersColumnsIcon = $('span.fa-caret-down');
        hostelCustomersColumnsIcon.addClass('fa-angle-down');
        hostelCustomersColumnsIcon.attr('style', 
            'margin-top: 0.7rem !important; color: #337ab7 !important');

        let columnsFilterLabelContainer = $('div.ui-multiselect-label-container');
        columnsFilterLabelContainer.append('<i class="material-icons view-week">view_week</i>');
    }    

    toogleRightBlockEvent($event: any): void {

        this.displaySchedule = false;
        this.displaySendEmail = false;
        this.displaySendSms = false;

        if($event.visibility === true) {
            this.displayRightBlock = true;
            this[`${$event.variableName}`] = true;
        } else {
            this.displayRightBlock = false;
        }

    };

    togglePaginateCustomersData(): void {
        this.paginateCustomers = !this.paginateCustomers;
    }

    toogleDisplayColumnsFiltersRow(): void {
        this.displayFilters = !this.displayFilters;
    }
    
    exportAllTableDataToCSV() {
        this.hostelCustomersPTable.exportCSV();
    }

    toggleAdvFiltersBlockVisibility(): void {
        this.displayAdvFilters = !this.displayAdvFilters;
    } 
}