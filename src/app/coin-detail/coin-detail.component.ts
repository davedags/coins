import { Component, Input, OnInit } from '@angular/core';
import { CoinDetailService } from './coin-detail.service';
import { PortfolioService } from '../portfolio/portfolio.service';
import { MessageService } from '../common/message.service';
import { BootstrapService } from '../common/bootstrap.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../common/auth.service';
import 'rxjs/add/operator/switchMap';


@Component({
    selector: 'app-coin-detail',
    providers: [
        CoinDetailService,
        PortfolioService
    ],
    templateUrl: './coin-detail.component.html',
    styleUrls: ['./coin-detail.component.css']
})
export class CoinDetailComponent implements OnInit {

    symbol: string;
    detail: any;
    price: any;
    error: boolean;
    inPortfolio: boolean = false;
    loggedIn: boolean = false;
    currentUser: any;
    tabs: any;

    @Input()
    activeTab: string;
 
    constructor(
        private coinService: CoinDetailService,
        private route: ActivatedRoute,
        private messageService: MessageService,
        private authService: AuthService,
        private portfolioService: PortfolioService,
        private bootstrapService: BootstrapService) {
        
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


    getData(): void {
        this.coinService.getData(this.symbol)
            .subscribe(
                data => {
                    this.detail = data[0],
                        this.price = data[1]
                },
                error => this.error = true
            );
        if (this.loggedIn) {
            this.portfolioService.get(this.symbol)
                .subscribe(
                    data => {
                        this.inPortfolio = data;
                    },
                    error => this.inPortfolio = false
                );
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
}
