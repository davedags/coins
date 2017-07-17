import { Component, OnInit } from '@angular/core';
import { BootstrapService } from '../common/bootstrap.service';
import { AuthService } from '../common/auth.service';
import { Coin } from '../model/coin';
import { LocalDataSource, ViewCell } from "ng2-smart-table/index";
import { Router } from "@angular/router";
import { CheckboxColumnComponent } from "./checkbox-column.component";
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-coins',
    templateUrl: './coins.component.html',
    styleUrls: ['./coins.component.css']
})
export class CoinsComponent implements OnInit {


    public coins: Coin[] = [];
    public source: LocalDataSource;
    public marketCap: number = 0;
    public init: boolean = false;
    public loading: Observable<boolean>;
    public searchTerm: string = '';
    public settings: Object = {};
    public allSettings: Object = {
        columns: {
            'in_portfolio': {
                title: '+/-',
                width: '2%',
                type: 'custom',
                renderComponent: CheckboxColumnComponent,
                onComponentInitFunction(instance) {
                    instance.save.subscribe(row => {
                    });
                }
            },
            'position': {
                title: '#',
                width: '5%'
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

                    return "<div><img class='coin-img' src='" + imgUrl + "' width='25px' height='25px' />" +
                        "<span class='coin-img-text'>&nbsp;&nbsp;" + value + "</span></div>";
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
                    return '$' + Number(value).toLocaleString('en', {
                            minimumFractionDigits: 4,
                            maximumFractionDigits: 8
                        })
                },
                compareFunction: (dir, a, b) => this.compareNumbers(dir, a, b)
            },
            'marketCap': {
                title: 'Market Cap',
                width: '30%',
                sort: 'desc',
                valuePrepareFunction: (value) => {
                    return '$' + Number(value).toLocaleString('en',
                            {maximumFractionDigits: 0})
                },
                compareFunction: (dir, a, b) => this.compareNumbers(dir, a, b)
            },
            'percent24': {
                title: '%24Hr',
                width: '10%',
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

    private portfolioColumn = {
        title: 'Portfolio',
        width: '5%',
        type: 'custom',
        renderComponent: CheckboxColumnComponent,
        onComponentInitFunction(instance) {
            instance.save.subscribe(row => {
            });
        }
    }

    constructor(private router: Router,
                private bootstrapService: BootstrapService,
                private authService: AuthService) {
        this.settings = this.allSettings;
        this.loading = this.bootstrapService.getLoading();
        if (!this.authService.getToken()) {
            delete this.settings['columns'].in_portfolio;
        }
    }
    
    ngOnInit(): void {
        this.bootstrapService.getCoins()
            .subscribe(
                coinData => {
                    this.coins = coinData.coins;
                    this.marketCap = coinData.totalMarketCap;
                    this.source = new LocalDataSource(this.coins);
                    this.init = true;
                }
            );
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


    
}
