import { Component, OnInit } from '@angular/core';
import { PortfolioService } from './portfolio.service';
import { LocalDataSource } from "ng2-smart-table/index";
import { Asset } from '../model/asset';
import { Router } from '@angular/router';
import { CheckboxColumnComponent } from '../coins/checkbox-column.component';

@Component({
    selector: 'app-portfolio',
    providers: [
        PortfolioService
    ],
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

    public coins: Asset[];
    public showTable: boolean = true;
    public source: LocalDataSource;
    public totalValue: number;
    public init;
    public settings: Object = {
        columns: {
            'in_portfolio': {
                title: '+/-',
                width: '5%',
                type: 'custom',
                renderComponent: CheckboxColumnComponent,
                onComponentInitFunction(instance) {
                    instance.portfolio = true;
                    instance.save.subscribe(row => {
                    });
                }
            },
            'name': {
                title: 'Name',
                width: '15%',
                type: 'html',
                valuePrepareFunction: (value, row) => {
                    let imgUrl = row.image_url;
                    if (!imgUrl) {
                        imgUrl = "/assets/icons/default.png";
                    }
                    return "<img src='" + imgUrl + "' width='25px' height='25px' /> " + value;
                }
            },
            'symbol': {
                title: 'Symbol',
                width: '10%'
            },

            'price': {
                title: 'Price',
                width: '30%',
                sort: 'desc',
                valuePrepareFunction: (value) => {
                    return '$' + Number(value).toLocaleString('en', { minimumFractionDigits: 4, maximumFractionDigits: 8})
                },
                compareFunction: (dir, a, b) => this.compareNumbers(dir, a, b)
            },
            'value': {
                title: 'Value',
                width: '30%',
                sort: 'asc',
                valuePrepareFunction: (value) => {
                    return '$' + Number(value).toLocaleString('en', { minimumFractionDigits: 0, maximumFractionDigits: 2})
                },
                compareFunction: (dir, a, b) => this.compareNumbers(dir, a, b)
            },
            'quantity': {
                title: '# Owned',
                width: '10%',
                sort: 'desc',
                valuePrepareFunction: (value) => {
                    return Number(value).toLocaleString('en',
                            { maximumFractionDigits: 5 })
                },
                compareFunction: (dir, a, b) => this.compareNumbers(dir, a, b)
            }
        },
        hideSubHeader: true,
        actions: {
            add: false,
            edit: false,
            delete: false
        },
        pager: {
            display: true,
            perPage: 50
        },
        attr: {
            class: 'table table-bordered table-striped table-hover table-rankings'
        },
        noDataMessage: "Loading Portfolio Data ..."

    };

    constructor(private portfolioService: PortfolioService, private router: Router) {}

    ngOnInit() {
        this.initList();
    }

    initList(): void {
        this.portfolioService.getList()
            .subscribe(
                coinData => {
                    this.coins = coinData.coins;
                    this.totalValue = coinData.totalValue;
                    this.source = new LocalDataSource(this.coins);
                    if (this.coins.length == 0) {
                        this.showTable = false;
                    }
                    this.init = true;
                }
            );
    }

    compareNumbers(dir: number, a: any, b: any): number {
        let a1 = Number(a);
        let b1 = Number(b);
        if (a1 < b1) {
            return -1 * dir;
        } else if (a1 > b1) {
            return dir;
        }
        return 0;
    }

    clickRow(event): void {

        let symbol = event.data.symbol;
        if (symbol) {
            this.router.navigate(['/coins', symbol]);
        }

    }

}
