import { Component, OnInit} from '@angular/core';
import { Coin, CoinsService } from './coins.service';
import { LocalDataSource } from "ng2-smart-table/index";

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
    public init;
    public searchTerm: string;
    public settings: Object = {
        columns: {
            'position': {
                title: '#',
                width: '10px'
            },
            'name': {
                title: 'Name',
                width: '20px'
            },
            'symbol': {
                title: 'Symbol',
                width: '10px'
            },

            'price': {
                title: 'Price',
                width: '35px',
                valuePrepareFunction: (value) => {
                    return '$' + Number(value).toLocaleString('en', { minimumFractionDigits: 4, maximumFractionDigits: 8})
                }
            },
            'marketcap': {
                title: 'Market Cap',
                width: '40px',
                valuePrepareFunction: (value) => { 
                    return '$' + Number(value).toLocaleString('en', 
                        { maximumFractionDigits: 0 }) 
                    }
            },
            'percent_24': {
                title: '%24Hr',
                width: '15px',
                valuePrepareFunction: (value) => {
                    return value + '%';
                },
                compareFunction: (dir, a, b) => {
                    let a1 = Number(a);
                    let b1 = Number(b);
                    if (a1 < b1) {
                        return -1 * dir;
                    } else if (a1 > b1) {
                        return dir;
                    }
                    return 0;
                }
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
    
    constructor(private coinService: CoinsService) {
        this.coins = [];
        this.init = false;
        this.searchTerm = '';
    }
    
    
    ngOnInit() {
        this.initList();
    }

    initList(): void {
        this.coinService.getCoins()
            .then(coins => {
                this.coins = coins;
                this.source = new LocalDataSource(coins);
                this.init = true;
            });
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
    
    
}
