import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ViewCell } from 'ng2-smart-table/index';

@Component({
    selector: 'button-view',
    template: `
    <button (click)="onClick($event)">{{ renderValue }}</button>
  `,
})
export class CoinsDetailButtonComponent implements ViewCell, OnInit {
    renderValue: string;

    @Input() value: string | number;
    @Input() rowData: any;

    @Output() save: EventEmitter<any> = new EventEmitter();

    ngOnInit() {
        this.renderValue = this.value.toString().toUpperCase();
    }

    onClick(event) {
        event.preventDefault();
        this.save.emit(this.rowData);
    }
}

