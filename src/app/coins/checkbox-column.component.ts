import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ViewCell } from "ng2-smart-table/index";
import { PortfolioService } from "../portfolio/portfolio.service";
import { MessageService } from "../common/message.service";
import { BootstrapService } from '../common/bootstrap.service';

@Component({
    selector: 'button-view',
    template: `
       
        <div class="checkbox" (click)="setChecked($event)" >  
              <label>
                  <input type="checkbox" [checked]="checked"  />  
              </label>
        </div>
       
    `,
    providers: [ PortfolioService ]
})
export class CheckboxColumnComponent implements ViewCell, OnInit {
    checked: boolean = false;
    symbol: string = '';
    portfolio: boolean = false;
    @Input() value: string | number;
    @Input() rowData: any;
    
    @Output() save: EventEmitter<any> = new EventEmitter();
    
    constructor( private portfolioService: PortfolioService, private messageService: MessageService, private bootstrapService: BootstrapService) {

    }

    ngOnInit() {
        this.symbol = this.rowData.symbol;
        if (this.rowData.in_portfolio) {
            this.checked = true;
        }
    }

    setChecked(event) {
        if (this.checked) {
            this.checked = false;
            this.portfolioRem();
        } else {
            this.checked = true;
            this.portfolioAdd();
        }
        event.stopPropagation();
        this.rowData.in_portfolio = this.checked;
        this.save.emit(this.rowData);
        if (this.portfolio) {
            this.bootstrapService.loadData();
        }
        event.preventDefault();
    }

    portfolioAdd() {
        this.portfolioService.add(this.symbol)
            .subscribe(
                success => {
                    this.messageService.sendMessage(this.symbol + ' has been added to your portfolio', 'Portfolio Updated');
                }
            );
    }

    portfolioRem() {
        this.portfolioService.remove(this.symbol)
            .subscribe(
                success => {
                    this.messageService.sendMessage(this.symbol + ' has been removed from your portfolio', 'Portfolio Updated');
                }
            );
    }


}

