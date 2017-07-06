import { Component, OnInit } from '@angular/core';
import { PortfolioService } from './portfolio.service';
import { LocalDataSource } from "ng2-smart-table/index";
import { Coin } from '../model/coin';
import {Router } from '@angular/router';

@Component({
    selector: 'app-portfolio',
    providers: [
        PortfolioService
    ],
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

    public coins: Coin[];
    public source: LocalDataSource;
    public marketCap: number;
    public init;
    public settings: Object = {
        columns: {
            'position': {
                title: '#',
                width: '10px'
            },
            'name': {
                title: 'Name',
                width: '20px',
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
                width: '10px'
            },

            'price': {
                title: 'Price',
                width: '35px',
                sort: 'desc',
                valuePrepareFunction: (value) => {
                    return '$' + Number(value).toLocaleString('en', { minimumFractionDigits: 4, maximumFractionDigits: 8})
                },
                compareFunction: (dir, a, b) => this.compareNumbers(dir, a, b)
            },
            'marketCap': {
                title: 'Market Cap',
                width: '40px',
                sort: 'desc',
                valuePrepareFunction: (value) => {
                    return '$' + Number(value).toLocaleString('en',
                            { maximumFractionDigits: 0 })
                },
                compareFunction: (dir, a, b) => this.compareNumbers(dir, a, b)
            },
            'percent24': {
                title: '%24Hr',
                width: '15px',
                sort: 'desc',
                valuePrepareFunction: (value) => {
                    return value + '%';
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
        noDataMessage: "Loading ..."

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
                    this.marketCap = coinData.totalMarketCap;
                    this.source = new LocalDataSource(this.coins);
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
