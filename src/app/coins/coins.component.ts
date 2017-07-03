import { Component, OnInit} from '@angular/core';
import { CoinsService } from './coins.service';
import { Coin } from './coin';
import { LocalDataSource } from "ng2-smart-table/index";
import { Router } from "@angular/router";
import { AuthService } from "../common/auth.service";
import { LocalStorageService } from "../common/local-storage.service";

@Component({
    selector: 'app-coins',
    providers: [
        CoinsService
    ],
    templateUrl: './coins.component.html',
    styleUrls: ['./coins.component.css']
})

export class CoinsComponent implements OnInit {
    
    
    public coins: Coin[];
    public source: LocalDataSource;
    public marketCap: number;
    public init;
    public searchTerm: string;
    public settings: Object = {
        columns: {
            'position': {
                title: '#',
                width: '10px'
            },/*
            'portfolio': {
                title: '+/-',
                width: '10px',
                type: 'html',
                valuePrepareFunction: (value, row) => {
                    return value + '<button type="button" (click)="addPortfolio(row.symbol, $event)" class="btn btn-default btn-xs">' +
                        '<span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>';
                }
            },*/
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
    
    constructor(private coinService: CoinsService, private router: Router, private localStorage: LocalStorageService) {
        this.coins = [];
        this.init = false;
        this.searchTerm = '';
        this.marketCap = 0;
    }
    
    
    ngOnInit() {
        this.initList();
    }

    initList(): void {
        if (this.cachedDataUnexpired()) {
            let cachedData = this.localStorage.get('mkcapData');
            if (cachedData) {
                this.coins = cachedData.coins;
                this.marketCap = cachedData.totalMarketCap;
                this.source = new LocalDataSource(this.coins);
                this.init = true;
            }
        }

        if (!this.init) {
            this.coinService.getCoins()
                .subscribe(
                    coinData => {

                        this.coins = coinData.coins;
                        this.marketCap = coinData.totalMarketCap;
                        this.source = new LocalDataSource(this.coins);
                        this.init = true;

                        let nowtime = +new Date();
                        this.localStorage.set('mkcapTime', nowtime);
                        this.localStorage.set('mkcapData', coinData)
                    }
                );
         }
    }

    cachedDataUnexpired(): boolean {
        let cachedTime = this.localStorage.get('mkcapTime');
        let nowtime = +new Date();
        if (cachedTime) {
            let diffTime: number = (nowtime - cachedTime);
            if (diffTime < 180000) {
                return true;
            }
        } else {
            this.localStorage.set('mkcapTime', nowtime);
        }
        return false;
    }

    doSearch(): void {
        if (this.init) {
            if (this.searchTerm) {
                this.source.setFilter([
                    {
                        field: 'name',
                        search: this.searchTerm
                    },
                    {
                        field: 'symbol',
                        search: this.searchTerm
                    }
                ], false);
            } else {
                this.source.reset();
            }
        }
    }

    clearSearch(): void {
        this.searchTerm = '';
        this.source.reset();
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

    addPortfolio(symbol, event): void {
        event.preventDefault();
        console.log('symbol = ' + symbol);
    }

}
