import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CoinDetailService } from './coin-detail.service';
import { PortfolioService } from '../portfolio/portfolio.service';
import { MessageService } from '../common/message.service';
import { BootstrapService } from '../common/bootstrap.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../common/auth.service';
import { AssetService } from '../common/asset.service';
import 'rxjs/add/operator/switchMap';


@Component({
    selector: 'app-coin-detail',
    providers: [
        CoinDetailService,
        PortfolioService,
        AssetService
    ],
    templateUrl: './coin-detail.component.html',
    styleUrls: ['./coin-detail.component.css']
})
export class CoinDetailComponent implements OnInit, OnDestroy {

    symbol: string;
    detail: any;
    price: any;
    error: boolean;
    inPortfolio: boolean = false;
    portfolioValue: any;
    portfolioValueCalculated: boolean = false;
    ownsAsset: boolean = false;
    quantityOwned: number;
    assetFetched: boolean = false;
    loggedIn: boolean = false;
    currentUser: any;
    tabs: any;
    digitInfo: string = '1.0-0';
    subscription: Subscription;

    @Input()
    activeTab: string;

    constructor(
        private coinService: CoinDetailService,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService,
        private authService: AuthService,
        private portfolioService: PortfolioService,
        private bootstrapService: BootstrapService,
        private assetService: AssetService) {
        this.detail = '';
        this.price = '';
        this.error = false;
        this.symbol = this.route.snapshot.params['id'];
        this.tabs = [
            { id: 'desc', name: 'Info', active: true},
            { id: 'features', name: 'Features', active: false},
            { id: 'tech', name: 'Tech', active: false}
        ];
        this.activeTab = 'desc';
        this.currentUser = this.authService.getCurrentUser();
        if (this.currentUser) {
            this.loggedIn = true;
        }
    }

    ngOnInit() {
        this.getData();
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    getData(): void {
        this.coinService.getData(this.symbol)
            .subscribe(
                data => {
                        this.detail = data[0];
                        this.price = data[1];
                        if (this.loggedIn) {
                            this.setPortfolioValue();
                        }
                },
                error => this.error = true
            );
        if (this.loggedIn) {
            this.portfolioService.get(this.symbol)
                .subscribe(
                    data => {
                        this.inPortfolio = data;
                        this.autoAddToPortfolio();
                    },
                    error => this.inPortfolio = false
                );
            this.assetService.get(this.symbol)
                .subscribe(
                    data => {
                        this.assetFetched = true;
                        if (data) {
                            this.ownsAsset = true;
                            this.quantityOwned = data;
                            this.setPortfolioValue();
                        }
                    }
                );
        }
    }

    autoAddToPortfolio() {
        if (!this.inPortfolio) {
            console.log('auto adding');
            this.subscription = this.route
                .queryParams
                .subscribe(params => {
                    if (params['portfolioAdd']) {
                        this.portfolioAdd();
                        this.router.navigate(["/coins", this.symbol]);
                    }
                });
        } else {
            console.log('allrady in, no need to add');
        }
    }
    selectTab(selectedTab: string, event): void {
        this.preventDefault(event);
        for (let i = 0; i < this.tabs.length; i++) {
            if (this.tabs[i].id == selectedTab) {
                this.tabs[i].active = true;
            } else {
                this.tabs[i].active = false;
            }
        }
    }

    preventDefault(event): void {
        event.preventDefault();
    }

    portfolioAdd() {
        if (!this.loggedIn) {
            let navExtras: NavigationExtras = {
                queryParams: { 'rtl' : this.symbol }
            }
            this.router.navigate(["/login"], navExtras);
        } else {
            this.portfolioService.add(this.symbol)
                .subscribe(
                    success => {
                        this.bootstrapService.loadData();
                        this.inPortfolio = true;
                        this.messageService.sendMessage(this.symbol + ' has been added to your portfolio', 'Portfolio Updated');
                    },
                    error => this.inPortfolio = false
                );
        }
    }

    portfolioRem() {
        this.portfolioService.remove(this.symbol)
            .subscribe(
                success => {
                    this.bootstrapService.loadData();
                    this.inPortfolio = false;
                    this.messageService.sendMessage(this.symbol + ' has been removed from your portfolio', 'Portfolio Updated');
                },
                error => this.error = true
            );
    }

    saveAsset() {
        this.portfolioValueCalculated = false;
        if (this.ownsAsset) {
            this.assetService.update(this.symbol, this.quantityOwned)
                .subscribe(
                    data => {
                        this.ownsAsset = true;
                    }
                );
        } else {
            this.assetService.create(this.symbol, this.quantityOwned)
                .subscribe(
                    data => {
                        this.ownsAsset = true;
                        this.messageService.sendMessage('', 'Portfolio Updated');
                    }
                );
        }
        this.setPortfolioValue();
    }

    delAsset() {
        this.assetService.delete(this.symbol)
            .subscribe(
                data => {
                    this.ownsAsset = false;
                    this.portfolioValueCalculated = false;
                    this.portfolioValue = 0;
                    this.quantityOwned = void 0;
                }
            );
    }

    setPortfolioValue() {
        if (this.price && this.quantityOwned && !this.portfolioValueCalculated) {
            let amount = this.price * this.quantityOwned;
            this.portfolioValue = Number(amount).toLocaleString('en-US', { maximumFractionDigits: 2 });
            this.portfolioValueCalculated = true;
        }
    }

}
