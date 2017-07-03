import { Component, Input, OnInit } from '@angular/core';
import { CoinDetailService } from './coin-detail.service';
import { MessageService } from '../common/message.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../common/auth.service';


@Component({
    selector: 'app-coin-detail',
    providers: [
        CoinDetailService
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
    tabs: any;

    @Input()
    activeTab: string;
 
    constructor(private coinService: CoinDetailService, private route: ActivatedRoute, private messageService: MessageService, private authService: AuthService) {
        
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
        let token = this.authService.getToken();
        if (token) {
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
            )
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

    portfolioAdd(symbol: string) {
        this.messageService.sendMessage(symbol + ' has been added to your portfolio', 'Portfolio Updated');
        this.inPortfolio = true;
    }

    portfolioRem(symbol: string) {
        this.messageService.sendMessage(symbol + ' has been removed from your portfolio', 'Portfolio Updated');
        this.inPortfolio = false;

    }
}
