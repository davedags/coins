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

@Component({
    selector: 'app-coins',
    templateUrl: './coins.component.html',
    styleUrls: ['./coins.component.css'],
    providers: [ Ng2DeviceService ]
})
export class CoinsComponent implements OnInit {

    public coins: Coin[] = [];
    public source: LocalDataSource;
    public marketCap: number = 0;
    public refreshing: boolean = false;
    public loading: Observable<boolean>;
    public searchTerm: string = '';
    public mobileDevice: boolean = false;
    public hideColumns: boolean = false;
    public allColumns: Object = {
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
            type: 'html',
            valuePrepareFunction: (value) => {
                let className = '';
                if (value >= 0) {
                    className = 'positive-change';
                } else {
                    className = 'negative-change';
                }
                return "<span class='" + className + "'>" + value + "%</span>";
            },
            compareFunction: (dir, a, b) => this.compareNumbers(dir, a, b)
        }
    };
    public otherSettings: Object = {
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
            class: 'table table-rankings'
        },
        noDataMessage: "No Results"
    };
    public settings: Object = {};

    constructor(private router: Router,
                private bootstrapService: BootstrapService,
                private authService: AuthService,
                private localStorageService: LocalStorageService,
                private deviceService: Ng2DeviceService) { }


    
    ngOnInit(): void {

        this.mobileDevice = this.deviceService.isMobile();
        this.loading = this.bootstrapService.getLoading();
        this.initializeTableSettings();
        this.bootstrapService.getCoins()
            .subscribe(
                coinData => {
                    this.coins = coinData.coins;
                    this.marketCap = coinData.totalMarketCap;
                    this.source = new LocalDataSource(this.coins);
                    if (this.refreshing) {
                        this.doSearch();
                        this.refreshing = false;
                    }

                }
            );
    }


    initializeTableSettings(): void {
        let mergedSettings = this.otherSettings;
        mergedSettings['columns'] = { ...this.allColumns};
        this.settings = mergedSettings;
        this.initializeColumnView();
    }

    initializeColumnView(): void {
        this.checkAndRemoveLoggedInColumns(this.settings['columns']);
        if (!this.mobileDevice) {
            this.hideColumns = false;
        } else {
            let colView = this.getColumnViewFromStorage();
            if (colView == null) {
                this.hideColumns = true;
                this.saveColumnViewToStorage();
            } else {
                this.hideColumns = colView;
            }
            if (this.hideColumns) {
                this.removeColumns(this.settings['columns']);
            }
        }
    }

    checkAndRemoveLoggedInColumns(cols) : void {
        if (!this.authService.getToken()) {
            delete cols.in_portfolio;
        }
    }

    removeColumns(cols): void {
        delete cols.name;
        delete cols.marketCap;
        delete cols.percent24;
    }

    toggleColumnView() {
        this.hideColumns = !this.hideColumns;
        this.saveColumnViewToStorage();
        let newCols = { ...this.allColumns};
        this.checkAndRemoveLoggedInColumns(newCols);
        if (this.hideColumns) {
            this.removeColumns(newCols);
        }
        let mergedSettings = this.otherSettings;
        mergedSettings['columns'] = newCols;
        this.settings = { ...mergedSettings};
    }

    getColumnViewFromStorage() : any {
        return this.localStorageService.get('listHideColumns');
    }

    saveColumnViewToStorage(): void {
        this.localStorageService.set('listHideColumns', this.hideColumns);
    }

    refreshList(): void {
        this.refreshing = true;
        this.bootstrapService.loadData();
    }
    doSearch(): void {
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
