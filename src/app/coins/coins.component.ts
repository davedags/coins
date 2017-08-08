import { Component, OnInit } from '@angular/core';
import { BootstrapService } from '../common/bootstrap.service';
import { AuthService } from '../common/auth.service';
import { LocalStorageService } from '../common/local-storage.service';
import { Ng2DeviceService } from 'ng2-device-detector';
import { Coin } from '../model/coin';
import { LocalDataSource, ViewCell } from "ng2-smart-table/index";
import { Router } from "@angular/router";
import { CheckboxColumnComponent } from "./checkbox-column.component";
import { Observable } from 'rxjs/Observable';
import * as _ from "lodash";


@Component({
    selector: 'app-coins',
    templateUrl: './coins.component.html',
    styleUrls: ['./coins.component.css'],
    providers: [ Ng2DeviceService ]
})
export class CoinsComponent implements OnInit {

    public cardView: boolean = false;
    public coins: Coin[] = [];
    public source: LocalDataSource;
    public marketCap: number = 0;
    public marketCapVol: number = 0;
    public marketCapBTC: number = 0;
    public init: boolean = false;
    public loading: Observable<boolean>;
    public searchTerm: string = '';
    public mobileDevice: boolean = false;
    public hideColumns: boolean = false;
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
                    if (!this.hideColumns) {
                        let imgUrl = row.image_url;
                        if (!imgUrl) {
                            imgUrl = "/assets/icons/default.png";
                        }

                        return "<div><img class='coin-img' src='" + imgUrl + "' width='25px' height='25px' />" +
                            "<span class='coin-img-text'>&nbsp;&nbsp;" + value + "</span></div>";
                    } else {
                        return value;
                    }
                }
            },
            'symbol': {
                title: 'Symbol',
                width: '10%',
                type: 'html',
                valuePrepareFunction: (value, row) => {
                    if (this.hideColumns) {
                        let imgUrl = row.image_url;
                        if (!imgUrl) {
                            imgUrl = "/assets/icons/default.png";
                        }

                        return "<div><img class='coin-img' src='" + imgUrl + "' width='25px' height='25px' />" +
                            "<span class='coin-img-text'>&nbsp;&nbsp;" + value + "</span></div>";
                    } else {
                        return value;
                    }
                }

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
            top: true,
            perPage: 50
        },
        attr: {
            class: 'table table-bordered table-striped table-hover table-rankings'
        },
        noDataMessage: "Loading ..."

    };

    constructor(private router: Router,
                private bootstrapService: BootstrapService,
                private authService: AuthService,
                private localStorageService: LocalStorageService,
                private deviceService: Ng2DeviceService) {
        this.settings = _.cloneDeep(this.allSettings);
        this.loading = this.bootstrapService.getLoading();
        if (!this.authService.getToken()) {
            delete this.settings['columns'].in_portfolio;
        }


        this.mobileDevice = this.deviceService.isMobile();
        let hc = this.getColumnViewFromStorage();
        if (hc == null) {
            this.hideColumns = this.mobileDevice;
            this.saveColumnViewToStorage();
        } else {
            this.hideColumns = hc;
        }
        if (this.hideColumns) {
            delete this.settings['columns'].name;
            delete this.settings['columns'].marketCap;
            delete this.settings['columns'].percent24;
        }

        let cv = this.localStorageService.get('listCardView');
        if (cv) {
            this.cardView = true;
        }
    }
    
    ngOnInit(): void {
        this.bootstrapService.getCoins()
            .subscribe(
                coinData => {
                    this.coins = coinData.coins;
                    this.marketCap = coinData.totalMarketCap;
                    //this.marketCapVol = coinData.totalMarketCapVol;
                    //this.marketCapBTC = coinData.totalMarketCapBTC;
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

    clickCard(symbol): void {
        this.router.navigate(['/coins', symbol]);
    }
    
    toggleCardView() {
        this.cardView = !this.cardView;
        this.localStorageService.set('listCardView', this.cardView);
        this.router.navigate(['']);
    }

    toggleColumnView() {

        this.hideColumns = !this.hideColumns;
        this.saveColumnViewToStorage();
        let newCols = {};
        if (this.hideColumns) {
            newCols = _.cloneDeep(this.allSettings['columns']);
            delete newCols['name'];
            delete newCols['marketCap'];
            delete newCols['percent24'];
        } else {
            newCols = _.cloneDeep(this.allSettings['columns']);
        }
        if (!this.authService.getToken()) {
            delete newCols['in_portfolio'];
        }
        this.settings = {
            columns: newCols,
            hideSubHeader: true,
            actions: {
                add: false,
                edit: false,
                delete: false
            },
            pager: {
                display: true,
                top: true,
                perPage: 50
            },
            attr: {
                class: 'table table-bordered table-striped table-hover table-rankings'
            },
            noDataMessage: "Loading ..."
        };


    }

    getColumnViewFromStorage() : any {
        let val = this.localStorageService.get('listHideColumns');
        return val;
    }

    saveColumnViewToStorage(): void {
        this.localStorageService.set('listHideColumns', this.hideColumns);
    }


    marketCapPopover(event) {
        console.log(event);
        console.log(event.path[1]);
        event.path[1].popover();
    }
    
}
