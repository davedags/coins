import { Component, OnInit, HostListener } from '@angular/core';
import { PortfolioService } from './portfolio.service';
import { Ng2DeviceService } from 'ng2-device-detector';
import { LocalDataSource } from "ng2-smart-table/index";
import { AuthService } from "../common/auth.service";
import { LocalStorageService } from "../common/local-storage.service";
import { Asset } from '../model/asset';
import { Router } from '@angular/router';
import { CheckboxColumnComponent } from '../coins/checkbox-column.component';

@Component({
    selector: 'app-portfolio',
    providers: [
        PortfolioService,
        Ng2DeviceService
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
    public allColumns: Object = {
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
            width: '20%',
            sort: 'desc',
            valuePrepareFunction: (value) => {
                return '$' + Number(value).toLocaleString('en', {
                        minimumFractionDigits: 4,
                        maximumFractionDigits: 8
                    })
            },
            compareFunction: (dir, a, b) => this.compareNumbers(dir, a, b)
        },
        'quantity': {
            title: 'Qty',
            width: '20%',
            sort: 'desc',
            valuePrepareFunction: (value) => {
                return Number(value).toLocaleString('en',
                    {maximumFractionDigits: 5})
            },
            compareFunction: (dir, a, b) => this.compareNumbers(dir, a, b)
        },
        'value': {
            title: 'Value',
            width: '30%',
            sort: 'asc',
            valuePrepareFunction: (value) => {
                return '$' + Number(value).toLocaleString('en', {minimumFractionDigits: 0, maximumFractionDigits: 2})
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
        noDataMessage: "Loading Portfolio Data"
    };
    public settings: Object = {};
    chartData: any[] = [];
    view: any[] = [500, 300];
    gradient: boolean = true;
    showLegend: boolean = true;
    showLabels: boolean = true;
    mobileDevice: boolean = false;
    showChart: boolean = false;
    toggleDisplay: string = 'show chart';
    hideColumns: boolean = false;

    constructor(private portfolioService: PortfolioService,
                private router: Router,
                private deviceService: Ng2DeviceService,
                private authService: AuthService,
                private localStorageService:  LocalStorageService) {}

    ngOnInit() {
        this.mobileDevice = this.deviceService.isMobile();
        if (this.mobileDevice) {
            this.showLegend = false;
        }
        this.initializeTableSettings();
        this.setDefaultFilters();
        if (this.showChart) {
            this.toggleDisplay = 'hide chart';
        }
        this.initList();
    }

    initializeTableSettings(): void {
        let mergedSettings = this.otherSettings;
        mergedSettings['columns'] = { ...this.allColumns};
        this.settings = mergedSettings;
        this.initializeColumnView();
    }

    initializeColumnView(): void {
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


    removeColumns(cols): void {
        delete cols.name;
        delete cols.price;
    }

    toggleColumnView() {
        this.hideColumns = !this.hideColumns;
        this.saveColumnViewToStorage();
        let newCols = { ...this.allColumns};
        if (this.hideColumns) {
            this.removeColumns(newCols);
        }
        let mergedSettings = this.otherSettings;
        mergedSettings['columns'] = newCols;
        this.settings = { ...mergedSettings};
    }

    getColumnViewFromStorage() : any {
        return this.localStorageService.get('portfolioHideColumns');
    }

    saveColumnViewToStorage(): void {
        this.localStorageService.set('portfolioHideColumns', this.hideColumns);
    }

    initList(): void {
        this.portfolioService.getList()
            .subscribe(
                coinData => {
                    this.chartData = [];
                    this.coins = coinData.coins;
                    this.totalValue = coinData.totalValue;
                    this.source = new LocalDataSource(this.coins);
                    if (this.coins.length == 0) {
                        this.showTable = false;
                    } else {
                        for (let coin of this.coins) {
                            this.chartData.push({ "name" : coin.symbol, "value": coin.value });
                        }
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

    toggleChartVisibility(): void {
        this.showChart = !this.showChart;
        if (this.showChart) {
            this.toggleDisplay = 'hide chart';
        } else {
            this.toggleDisplay = 'show chart';
        }
        this.localStorageService.set(PortfolioComponent.getChartVisibilityStorageKey(), this.showChart);
    }

    static getChartVisibilityStorageKey(): string  {
        return 'portfolio_show_chart';
    }

    setDefaultFilters(): void {
        let defaultKey = 'portfolio_default_filters';
        let setDefaults = this.localStorageService.get(defaultKey);
        if (!setDefaults) {
            let currentUser = this.authService.getCurrentUser();
            if (currentUser['default_chart_visibility'] == 'show') {
                this.showChart = true;
            } else {
                this.showChart = false;
            }
            this.localStorageService.set(defaultKey, true);
        } else {
            let storedValue = this.localStorageService.get(PortfolioComponent.getChartVisibilityStorageKey());
            if (storedValue) {
                this.showChart = true;
            }
        }
    }

    onChartSliceSelect(event) {
        console.log(event);
    }
    
    @HostListener('window:resize', ['$event'])
    onResize(event){
        let w = event.target.innerWidth;
        if (w < 670) {
            this.showLegend = false;
        } else {
            this.showLegend = true;
        }
    }
}
