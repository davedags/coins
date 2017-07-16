import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ViewCell } from 'ng2-smart-table/index';

@Component({
    selector: 'button-view',
    template: `
    <ui-switch [checked]="checked" (change)="onChange($event)"></ui-switch>
  `,
})
export class PortfolioToggleComponent implements ViewCell, OnInit {
    renderValue: string;

    @Input() value: string | number;
    @Input() rowData: any;

    @Output() save: EventEmitter<any> = new EventEmitter();

    ngOnInit() {
        //this.renderValue = this.value.toString().toUpperCase();
    }

    onChange(event) {

        console.log(event);

        //event.preventDefault();
        this.save.emit(this.rowData);
        return false;
    }
}

